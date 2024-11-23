const User = require('../models/userModel');
const Demo = require('../models/demoModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redis');
const Service = require('../models/serviceModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, phoneNumber, country, password } = req.body;
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
  await redisClient.setEx(`user:${user._id}`, 2592000 , JSON.stringify(user));

  const service = await Service.create({
    userId: user._id,
    subscription: 'Basic',
    subscriptionDetails: {
      startDateTime: new Date(),
      endDateTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
    totalCost: 0,
  });
  await redisClient.setEx(`service:${user._id}`, 2592000, JSON.stringify(service));
  res.status(201).json({ message: 'User created successfully' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const cachedUser = await redisClient.get(`user:${email}`);
    let user;
    if(cachedUser){
      user= JSON.parse(cachedUser);
    }else{
      user= await User.findOne({ email: email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const demoRequest = async (req, res) => {
  try {
    const { contactName, companyName, email, phoneNumber, website, requestPurpose } = req.body;
    const demoExists = await Demo.findOne({ email });
    if (demoExists) {
      return res.status(400).json({ message: 'Demo request already exists' });
    }
    const demo = await Demo.create({
      contactName,
      companyName,
      email,
      phoneNumber,
      website,
      requestPurpose,
      status: 'pending',
    });
    await redisClient.setEx(`demo:${demo._id}`, 2592000, JSON.stringify(demo));
    res.status(201).json({ message: 'Demo request created successfully' });
  } catch (err) {
    console.error('Error creating demo request:', err);
    res.status(500).send('Server Error');
  }
};

module.exports = { registerUser, loginUser, generateToken, demoRequest };
