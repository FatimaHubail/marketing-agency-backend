const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Client = require('../models/client');

const SALT_ROUNDS = 10;

const login = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email });

    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const payload = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role,
    };

    if (userInDatabase.role === 'client') {
      const client = await Client.findOne({ user: userInDatabase._id });
      if (client) {
        payload.clientId = client._id;
      }
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: error.message });
  }
};

const registerClient = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const {
      companyName,
      industry,
      contactPerson,
      contactEmail,
      contactPhone,
      preferredContactMethod,
      website,
      socialMediaPlatforms,
      targetAudience,
      guideLinesUrl,
      budgetTier,
      address } = req.body;

    const requiredClientFields = {
      companyName, industry, contactPerson, contactEmail,
      contactPhone, preferredContactMethod, budgetTier,
    };

    const userInDb = await User.findOne({ email });
    if (userInDb) return res.status(409).json({ err: 'Email already registered' });

    const clientInDb = await Client.findOne({ contactEmail });
    if (clientInDb) return res.status(409).json({ err: 'Email already exist' });

    for (const [key, value] of Object.entries(requiredClientFields)) {
      if (!value) {
        return res.status(400).json({ err: `${key} is required` });
      }
    }

    if (!address?.building || !address?.road || !address?.block ||
      !address?.area || !address?.governorate) {
      return res.status(400).json({ err: 'Complete address is required' });
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'client',
    });

    let client;

    try {
      client = await Client.create({
        user: user._id,
        companyName, industry, contactPerson, contactEmail, contactPhone,
        preferredContactMethod, website, socialMediaPlatforms,
        targetAudience, guideLinesUrl, budgetTier, address,
      });
    } catch (clientErr) {
      await User.findByIdAndDelete(user._id);

      if (clientErr.name === 'ValidationError') {
        return res.status(400).json({ err: clientErr.message });
      }
      throw clientErr;
    }

    const payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
      clientId: client._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }

};

module.exports = {
  login,
  registerClient,
};