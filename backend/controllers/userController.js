// userController.js
const { get } = require('mongoose');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const Demo = require('../models/demoModel')
const ApiOneCreditUsage = require('../services/api1');
const ApiTwoCreditUsage = require('../services/api2');
const crypto = require('crypto');
const sendAcceptanceEmail = require('../models/emailModel');
const mongoose = require('mongoose');

const useApiOne = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const service = await Service.findOne({ userId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const apiCreditUsage = new ApiOneCreditUsage(user.credits);
    const result = apiCreditUsage.performApiOneTask();

    if (result.success) {
      user.credits = result.remainingCredits;
      service.servicesUsed.set('api1', (service.servicesUsed.get('api1') || 0) + result.apiCredits);
      await service.save();
      await user.save();
      return res.json({ message: 'Task successful', credits: user.credits, apiCredits: result.apiCredits });
    } else {
      return res.json({ message: result.message, credits: user.credits, apiCredits: result.apiCredits });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const useApiTwo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const service = await Service.findOne({ userId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const apiCreditUsage = new ApiTwoCreditUsage(user.credits);
    const result = apiCreditUsage.performApiTwoTask();
    if (result.success) {
      user.credits = result.remainingCredits;
      service.servicesUsed.set('api2', (service.servicesUsed.get('api2') || 0) + result.apiCredits);
      await service.save();
      await user.save();
      return res.json({ message: 'Task successful', credits: user.credits, apiCredits: result.apiCredits });
    } else {
      return res.json({ message: result.message, credits: user.credits, apiCredits: result.apiCredits });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUserCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ credits: user.credits });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const generateSecretKey = async (req, res) => {
  const userId = req.user.id;
  const secretKey = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  await User.findByIdAndUpdate(userId, { secretKey, secretKeyExpiry: expiry });
  res.json({ secretKey });
};

const getSecretKey = async (req, res) => {
  const userId = req.user.id;
  // console.log('userId',userId);
  const user = await User.findById(userId);
  // console.log(user.secretKey);
  return res.json({ secretKey: user.secretKey });
};

const recharge1 = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  console.log(user.email);
  await User.updateOne({_id: userId}, {credits: user.credits + 100});
  console.log(user.credits);
  return res.json({ message: 'done recharge' });
}

const recharge2 = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  console.log(user.email);
  await User.updateOne({_id: userId}, {credits: user.credits + 200});
  console.log(user.credits);
  return res.json({ message: 'done recharge' });
}

const fetchRequests = async(req,res)=>{
  const pendingRequests = await Demo.find({ status: 'pending' });
  res.json(pendingRequests);
}

const updateRequests = async(req,res)=>{
  const { id, status } = req.body;
  console.log(id, status);
  const demo = await Demo.findById(id);
  if(status === 'declined'){
    await Demo.findByIdAndUpdate(id, { status });
    return res.json({ message: 'Request updated' });
  }
  const { password } = await sendAcceptanceEmail(demo.email, demo.contactName);
  await Demo.findByIdAndUpdate(id, { status });
  const user=await User.create({
    _id: new mongoose.Types.ObjectId(),
    firstName: demo.contactName,
    email: demo.email,
    lastName: demo.companyName,
    username: demo.email,
    country: 'India',
    password,
    phoneNumber: demo.phoneNumber,
  });
  user.save();

  console.log(password);
  res.json({ message: 'Request updated' });
}

module.exports = { useApiOne, useApiTwo, getUserCredits, generateSecretKey, getSecretKey, recharge1, recharge2, fetchRequests, updateRequests };
