const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const redisClient = require('../config/redis');
const { registerUser, loginUser, generateToken, demoRequest } = require('../controllers/authController');
const { useApiOne, useApiTwo, useApiThree ,getUserCredits, generateSecretKey, getSecretKey, recharge1, recharge2, fetchRequests, updateRequests } = require('../controllers/userController');
const {verifyToken, validateSecretKey, verifyAdmin} = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/signup', registerUser);

router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log(req.user);
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/landing?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

router.post('/api1', verifyToken, validateSecretKey ,useApiOne);
router.post('/api2', verifyToken, validateSecretKey ,useApiTwo);
router.post('/api3', useApiThree);

router.get('/user/credits', verifyToken, getUserCredits);

router.post('/generate-secret-key', verifyToken, generateSecretKey);
router.get('/check-secret-key', verifyToken, getSecretKey);

router.get('/userDetails', verifyToken, async (req, res) => {
  console.log('Fetching user details...');
  const userId = req.user.id;
  try {
    const cachedUser = await redisClient.get(`user:${userId}`);
    const cachedService = await redisClient.get(`service:${userId}`);

    if (cachedUser && cachedService) {
      return res.json({
        user: JSON.parse(cachedUser),
        service: JSON.parse(cachedService),
      });
    }

    const user = await User.findById(userId);
    const service = await Service.findOne({ userId: userId });
    console.log('User:', user);
    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));
    await redisClient.setEx(`service:${userId}`, 3600, JSON.stringify(service));

    return res.json({ user, service });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/recharge1', verifyToken, validateSecretKey, recharge1);
router.post('/recharge2', verifyToken, validateSecretKey, recharge2);

router.post('/demo-request', demoRequest);
router.get('/pending-requests', fetchRequests);
router.put('/update-request-status', updateRequests);

module.exports = router;
