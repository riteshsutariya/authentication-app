const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/User');

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
}

const verifyCallback = async (email, password, done) => {
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return done(null, false)
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log("Error: " + err);
        return res.send('Something Went Wrong!!');
      }
      console.log(result);
      if (result) {
        console.log("VALIDATION SUCCESS")
        return done(null, user);
      }
      else {
        console.log("VALIDATION NOT SUCCESS!!")
        return done(null, false, { message: 'invalid username/password' });
      }
    })
  }).catch(err => {
    console.log("Error: " + err);
    done(err);
  })
}

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((userId, done) => {
  User.findById(userId).then((user) => {
    done(null, user);
  }).catch(err => {
    done(err);
  })
})

passport.use(strategy);