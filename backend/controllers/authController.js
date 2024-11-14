const User = require('../models/userModel');
const Demo = require('../models/demoModel')
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, username, email, phoneNumber, country, password } = req.body;
    console.log('Signup form data:', req.body);
    if (!firstName || !lastName || !username || !email || !phoneNumber || !country || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      country,
      password,
      secretKey: null,
    });
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        country: user.country,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  };  

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const demoRequest = async (req,res) => {
  const {contactName, companyName, email, phoneNumber, website, requestPurpose}= req.body;
  const demoExists = await Demo.findOne({email});
  if(demoExists){
    return res.json({message:"You're already in the queue. We'll get back to you soon!"})
  }
  const demo= await Demo.create({
    contactName, companyName, email, phoneNumber, website, requestPurpose
  })
  demo.save();
  return res.json({message:"Request submitted successfully!"});
}

module.exports = { registerUser, loginUser, generateToken, demoRequest };
