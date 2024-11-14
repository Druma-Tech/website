const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Service = require('../models/serviceModel.js');

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  lastName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  username: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    unique: true,
  },
  email: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phoneNumber: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  country: {
    type: String,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  credits: {
    type: Number,
    default: 100,
  },
  googleId: {
    type: String,
  },
  secretKey: { type: String, default: null },
  secretKeyExpiry: { type: Date, default: null },
  role:{type:String, default:'user'}
}, {
  timestamps: true,
});

// Hash password if it's set (non-Google users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.findOrCreateGoogleUser = async function (profile) {
  let user = await this.findOne({ googleId: profile.id });
  console.log("hey")
  if (!user) {
    user = await this.create({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      username: profile.displayName,
      credits: 100,
      secretKey: null,
    });
  }

  console.log(user._id);

  await Service.create({
    userId: user._id,
    subscription: 'Basic',
    subscriptionDetails: {
      startDateTime: new Date(),
      endDateTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
    servicesUsed: {
      Api1: 0,
      Api2: 0,
    },
    totalCost: 0,
  });

  return user;
};

module.exports = mongoose.model('User', userSchema);
