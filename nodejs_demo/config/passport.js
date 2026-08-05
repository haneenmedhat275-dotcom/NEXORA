const passport = require('passport');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const User = require('../models/user');
      let user = await User.findOne({ email: profile.emails?.[0]?.value });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value || `google_${profile.id}@placeholder.com`,
          password: require('crypto').randomBytes(16).toString('hex'),
          isOnboarded: false,
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const FacebookStrategy = require('passport-facebook').Strategy;
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const User = require('../models/user');
      const email = profile.emails?.[0]?.value;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: email || `facebook_${profile.id}@placeholder.com`,
          password: require('crypto').randomBytes(16).toString('hex'),
          isOnboarded: false,
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

module.exports = passport;
