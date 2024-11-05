const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      // Required if the user is not signing up via Google SSO
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
    required: function () {
      return !this.googleId;
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;  // Password is required only for traditional signup
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
}, {
  timestamps: true,
});

// Hash password if it's set (non-Google users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // Only hash the password if the user is not a Google user and password exists
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Match password for regular login (non-Google users)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to handle Google login
userSchema.statics.findOrCreateGoogleUser = async function (profile) {
  let user = await this.findOne({ googleId: profile.id });

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

  return user;
};

module.exports = mongoose.model('User', userSchema);
