const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const { registerUser, loginUser, generateToken, demoRequest } = require('../controllers/authController');
const { useApiOne, useApiTwo, getUserCredits, generateSecretKey, getSecretKey, recharge1, recharge2, fetchRequests, updateRequests } = require('../controllers/userController');
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

router.get('/user/credits', verifyToken, getUserCredits);

router.post('/generate-secret-key', verifyToken, generateSecretKey);
router.get('/check-secret-key', verifyToken, getSecretKey);

router.get('/userDetails', verifyToken, async(req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const service = await Service.findOne({userId: userId});
  return res.json({user, service});
}); 

router.post('/recharge1', verifyToken, validateSecretKey, recharge1);
router.post('/recharge2', verifyToken, validateSecretKey, recharge2);

router.post('/demo-request', demoRequest);
router.get('/pending-requests', fetchRequests);
router.put('/update-request-status', updateRequests);

module.exports = router;
