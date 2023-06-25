// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const User = require('../models/user');

router.get('/:username', ensureAuthenticated, async (req, res) => {

  const username = req.params.username;
  const user = await User.findOne(username);

  if (user) {
    res.render('private/user', { user: user });
  } else {
    res.status(404).send('User not found');
  }



});

module.exports = router;
