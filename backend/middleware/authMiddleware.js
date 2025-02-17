const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const redisClient = require('../config/redis');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyAdmin = async(req,res,next)=>{
  const token= req.headers['authorization']?.split(' ')[1];
  if(!token){
    return res.status(403).json({message: "Admin Access Denied."});
  }
  try{
    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    const user= await User.findById(req.user.id);
    if(user.role=='admin'){
      next();
    }else{
      return res.status(401).json({message:"Admins allowed only"});
    }
  }catch(err){
    return res.status(401).json({message:"Invalid token"});
  }
}

const validateSecretKey = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cachedUser = await redisClient.get(`user:${userId}`);
    let user;
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findById(userId);
      await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));
    }
    const { secretKey, secretKeyExpiry } = user;
    if (!secretKey || secretKeyExpiry < Date.now()) {
      return res.status(403).json({ message: 'Invalid or expired secret key.' });
    }
    next();
  } catch (error) {
    console.error('Error validating secret key:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { protect, verifyToken, validateSecretKey, verifyAdmin };
