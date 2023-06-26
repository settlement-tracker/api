// passportSetup.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(new LocalStrategy((username, password, done) => {
  // Match user
  // This should match the user from your database, this is just a placeholder
  User.findOne(username)
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'That username is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    })
    .catch(err => console.log(err));
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

