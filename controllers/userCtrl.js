const bcrypt = require('bcrypt');
const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({
      username: req.body.username
    });

    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      departmentId: req.body.departmentId
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};

const getOneUser = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({err: 'User not found'});
        }

        res.status(200).json(user);

    }catch(err){
        res.status(500).json({err: error.message});
    }
}



module.exports = {
  createUser, updateUser, getUsers, getOneUser,
};