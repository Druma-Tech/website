const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, generateToken } = require('../controllers/authController');
const { useApiOne, useApiTwo, getUserCredits } = require('../controllers/userController');
const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/signup', registerUser);

router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log(req.user);
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/microsoft', passport.authenticate('microsoft'));
router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/apple', passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

router.post('/api1', verifyToken,useApiOne);
router.post('/api2', verifyToken,useApiTwo);
router.get('/user/credits', verifyToken, getUserCredits);


module.exports = router;
