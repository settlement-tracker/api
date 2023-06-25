// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  // Render login page
  res.render('public/login')
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next)
}
);

module.exports = router;
