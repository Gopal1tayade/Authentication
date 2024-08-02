const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require("express");
const googleroutes = express.Router();
const {handleStudentLogin ,handleLogOut}=require("../Controller/Student");
const {googleAuth} = require("../midleware/googleAuth");
require("dotenv").config();
const User = require("../Models/user");
const {auth} = require("../midleware/sessionAuthentication");




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/login/google/auth/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        // Find or create the user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            profilePhoto: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
  }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });


  googleroutes.route('/auth/google').get( passport.authenticate('google', { scope: ['profile', 'email'] }));

  googleroutes.route('/google/auth/callback').get(googleAuth , handleStudentLogin);

  googleroutes.route('/logout').get(auth,handleLogOut);
  
  

module.exports = googleroutes;



