// userController.js
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const Demo = require('../models/demoModel')
const ApiOneCreditUsage = require('../services/api1');
const ApiTwoCreditUsage = require('../services/api2');
const crypto = require('crypto');
const {sendAcceptanceEmail, sendRejectionEmail} = require('../models/emailModel');
const mongoose = require('mongoose');
const redisClient = require('../config/redis');

const useApiOne = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user from Redis or fallback to MongoDB
    let user = await redisClient.get(`user:${userId}`);
    if (!user) {
      user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      await redisClient.setEx(`user:${userId}`, 3600 * 24 * 30, JSON.stringify(user)); // Cache the user
    } else {
      user = JSON.parse(user);
    }

    // Fetch service from Redis or fallback to MongoDB
    let service = await redisClient.get(`service:${userId}`);
    if (!service) {
      service = await Service.findOne({ userId });
      if (!service) return res.status(404).json({ message: 'Service not found' });
      await redisClient.setEx(`service:${userId}`, 3600 * 24 * 30, JSON.stringify(service)); // Cache the service
    } else {
      service = JSON.parse(service);
    }

    // Initialize servicesUsed if empty
    if (!service.servicesUsed) {
      service.servicesUsed = {};
    }

    // Perform API credit usage operation
    const apiCreditUsage = new ApiOneCreditUsage(user.credits);
    const result = apiCreditUsage.performApiOneTask();

    if (result.success) {
      // Update user credits
      user.credits = result.remainingCredits;

      // Update or add API1 usage in servicesUsed
      service.servicesUsed.api1 = (service.servicesUsed.api1 || 0) + result.apiCredits;

      // Cache updated user and service
      await redisClient.setEx(`user:${userId}`, 3600 * 24 * 30, JSON.stringify(user));
      await redisClient.setEx(`service:${userId}`, 3600 * 24 * 30, JSON.stringify(service));

      return res.json({
        message: 'Task successful',
        credits: user.credits,
        apiCredits: result.apiCredits,
      });
    } else {
      return res.json({
        message: result.message,
        credits: user.credits,
        apiCredits: result.apiCredits,
      });
    }
  } catch (err) {
    console.error('Error in useApiOne:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



const useApiTwo = async (req, res) => {
  try {
    const userId = req.user.id;

    let user = await redisClient.get(`user:${userId}`);
    if (!user) {
      user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      await redisClient.setEx(`user:${userId}`, 3600 * 24 * 30, JSON.stringify(user)); // Cache the user
    } else {
      user = JSON.parse(user);
    }

    let service = await redisClient.get(`service:${userId}`);
    if (!service) {
      service = await Service.findOne({ userId });
      if (!service) return res.status(404).json({ message: 'Service not found' });
      await redisClient.setEx(`service:${userId}`, 3600 * 24 * 30, JSON.stringify(service)); // Cache the service
    } else {
      service = JSON.parse(service);
    }

    const apiCreditUsage = new ApiTwoCreditUsage(user.credits);
    const result = apiCreditUsage.performApiTwoTask();

    if (result.success) {
      user.credits = result.remainingCredits;
      service.servicesUsed.api2 = (service.servicesUsed.api2 || 0) + result.apiCredits;
      await redisClient.setEx(`user:${userId}`, 3600 * 24 * 30, JSON.stringify(user));
      await redisClient.setEx(`service:${userId}`, 3600 * 24 * 30, JSON.stringify(service));

      return res.json({
        message: 'Task successful',
        credits: user.credits,
        apiCredits: result.apiCredits,
      });
    } else {
      return res.json({
        message: result.message,
        credits: user.credits,
        apiCredits: result.apiCredits,
      });
    }
  } catch (err) {
    console.error('Error in useApiTwo:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



const getUserCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      const userData = JSON.parse(cachedUser);
      return res.json({ credits: userData.credits });
    }
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
  try {
    const secretKey = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      const userData = JSON.parse(cachedUser);
      userData.secretKey = secretKey;
      userData.secretKeyExpiry = expiry;
      await redisClient.setEx(`user:${userId}`, 3600*24*30, JSON.stringify(userData));
    } else {
      await redisClient.setEx(`user:${userId}:secretKey`, 3600*24*30, JSON.stringify({ secretKey, secretKeyExpiry: expiry }));
    }
    res.json({ secretKey });
  } catch (error) {
    console.error('Error generating secret key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getSecretKey = async (req, res) => {
  const userId = req.user.id;
  const cachedUser = await redisClient.get(`user:${userId}`);
  if (cachedUser) {
    const userData = JSON.parse(cachedUser);
    return res.json({ secretKey: userData.secretKey });
  }
  const user = await User.findById(userId);
  return res.json({ secretKey: user.secretKey });
};

const recharge1 = async (req, res) => {
  const userId = req.user.id;
  const cachedUser = await redisClient.get(`user:${userId}`);
  if (cachedUser) {
    const userData = JSON.parse(cachedUser);
    userData.credits += 100;
    await redisClient.setEx(`user:${userId}`, 3600*24*30, JSON.stringify(userData));
    return res.json({ message: 'done recharge' });
  }
  const user = await User.findById(userId);
  user.credits += 100;
  await redisClient.setEx(`user:${userId}`, 3600*24*30, JSON.stringify(user));
  return res.json({ message: 'done recharge' });
}

const recharge2 = async (req, res) => {
  const userId = req.user.id;
  const cachedUser = await redisClient.get(`user:${userId}`);
  if (cachedUser) {
    const userData = JSON.parse(cachedUser);
    userData.credits += 200;
    await redisClient.setEx(`user:${userId}`, 3600*24*30, JSON.stringify(userData));
    return res.json({ message: 'done recharge' });
  }
  const user = await User.findById(userId);
  user.credits += 200;
  await redisClient.setEx(`user:${userId}`, 3600*24*30, JSON.stringify(user));
  return res.json({ message: 'done recharge' });
}

const fetchRequests = async (req, res) => {
  try {
    const keys = await redisClient.keys('demo:*');
    const DemoRequests = await Promise.all(keys.map(async (key) => {
      const request = await redisClient.get(key);
      return JSON.parse(request);
    }));
    console.log(DemoRequests);
    const pendingRequests = DemoRequests.filter((request) => request.status === 'pending');
    res.json({ requests: pendingRequests });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// const updateRequests = async (req, res) => {
//   const { id, status } = req.body;
//   try {
//     console.log(id, status);
//     const demo = await Demo.findById(id);

//     const cachedDemoRequests = await redisClient.get('demoRequests:pending');
//     if (cachedDemoRequests) {
//       const parsedRequests = JSON.parse(cachedDemoRequests);
//       if(status === 'accepted'){
//         parsedRequests.filter((request) => request._id !== id);
//       }
//       else{
//         parsedRequests.map((request) => {
//           if(request._id === id){
//             request.status = status;
//           }
//         });
//       }
//     }
//     if (status === 'declined') {
//       await Demo.findByIdAndUpdate(id, { status });
//       await redisClient.del('demoRequests:pending');
//       return res.json({ message: 'Request updated' });
//     }

//     const { password } = await sendAcceptanceEmail(demo.email, demo.contactName);
//     await Demo.findByIdAndUpdate(id, { status });

//     const user = await User.create({
//       _id: new mongoose.Types.ObjectId(),
//       firstName: demo.contactName,
//       email: demo.email,
//       lastName: demo.companyName,
//       username: demo.email,
//       country: 'India',
//       password,
//       phoneNumber: demo.phoneNumber,
//     });
//     await user.save();

//     console.log(password);
//     await redisClient.del('demoRequests:pending');

//     res.json({ message: 'Request updated' });
//   } catch (error) {
//     console.error('Error updating demo request:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const updateRequests = async (req, res) => {
  const { id, status } = req.body;
  console.log(id, status);
  try {
    const cachedRequest = await redisClient.get(`demo:${id}`);
    if(cachedRequest){
      const request= JSON.parse(cachedRequest);
      if(status==='accepted'){
        request.status='accepted';
        await sendAcceptanceEmail(request.email, request.contactName);
      }else{
        request.status='declined';
        await sendRejectionEmail(request.email, request.contactName);
      }
      await redisClient.setEx(`demo:${id}`, 3600*24*30, JSON.stringify(request));
      return res.json({ message: 'Request updated' });
    }
  } catch (error) {
    console.error('Error updating demo request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { useApiOne, useApiTwo, getUserCredits, generateSecretKey, getSecretKey, recharge1, recharge2, fetchRequests, updateRequests };
