const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Client = require('../models/client');

const SALT_ROUNDS = 10;

const signup = async (req, res) => {
  try {
    // verify if the username alrady exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    // if the user exists send error msg
    if (userInDatabase) {
      return res.status(409).json({ err: 'Invalid input' });
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    req.body.password = hashedPassword;

    // else lets check if the password match
    // if password matches create the new user
    const user = await User.create(req.body);
    const payload = {
      username: user.username,
      _id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'something went wrong' });
  }
};

const login = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    // only allow users that exist to login
    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    // make sure the user's password matches the req.body.password
    if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    const payload = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

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

    // validating required fields
    for (const [key, value] of Object.entries(requiredClientFields)) {
      if (!value) {
        return res.status(400).json({ err: `${key} is required` });
      }
    }

    if (!address?.building || !address?.road || !address?.block ||
      !address?.area || !address?.governorate) {
      return res.status(400).json({ err: 'Complete address is required' });
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    // create the User
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
      // Client failed, the User it depends on shouldn't exist either
      await User.findByIdAndDelete(user._id);

      if (clientErr.name === 'ValidationError') {
        return res.status(400).json({ err: clientErr.message });
      }
      throw clientErr;
    }

    const payload = {
      username: user.username,
      _id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }
  
}; 

module.exports = {
  signup,
  login,
  registerClient,
};
