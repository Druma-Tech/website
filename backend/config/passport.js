const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/userModel');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        return done(null, user);
      }
    }catch(err){
      return done(err, false);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/facebook/callback`,
    profileFields: ['id', 'emails', 'name'] // Request user email
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/microsoft/callback`,
    scope: ['user.read'] // Request user read scope
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH, // Path to private key file
    callbackURL: `${process.env.CALLBACK_URL}/apple/callback`,
    scope: ['name', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
