const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const MicrosoftStrategy = require('passport-microsoft').Strategy;
// const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
require('dotenv').config();

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientID: process.env.GOOGLE_CLIENT_ID,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        console.log(profile);
        user = new User({
          googleId: profile.id,
          firstName: profile.name.givenName,
          email: profile.emails[0].value,
          username: profile.displayName,
        });
        await user.save();

        await Service.create({
          userId: user._id,
          subscription: 'Basic',
          subscriptionDetails: {
            startDateTime: new Date(),
            endDateTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
          totalCost: 0,
        });
        
        return done(null, user);
      }
    }catch(err){
      return done(err, false);
    }
  }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
