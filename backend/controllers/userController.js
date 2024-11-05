// userController.js
const { get } = require('mongoose');
const User = require('../models/userModel');
const ApiOneCreditUsage = require('../services/api1');
const ApiTwoCreditUsage = require('../services/api2');
const crypto = require('crypto');

const useApiOne = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const apiCreditUsage = new ApiOneCreditUsage(user.credits);
    const result = apiCreditUsage.performApiOneTask();

    if (result.success) {
      user.credits = result.remainingCredits;
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

    if (!user) return res.status(404).json({ message: 'User not found' });

    const apiCreditUsage = new ApiTwoCreditUsage(user.credits);
    const result = apiCreditUsage.performApiTwoTask();

    if (result.success) {
      user.credits = result.remainingCredits;
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

const generateSecretKey = async(req,res) => {
  const userId = req.user.id;
  const secretKey = crypto.randomBytes(32).toString('hex'); 
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  await User.findByIdAndUpdate(userId, { secretKey, secretKeyExpiry: expiry });
  res.json({ secretKey });
};

module.exports = { useApiOne, useApiTwo, getUserCredits, generateSecretKey };
