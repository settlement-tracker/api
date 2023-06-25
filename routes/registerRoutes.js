// routes/registerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // assuming you have a User model defined in models/User.js
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('public/register')
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
      is_active: true,
      is_admin: true
    });

    // Save the user to the database
    const [{ id }] = await User.create(newUser)




    newUser.id = id;
    // Log the user in
    req.logIn(newUser, err => {
      if (err) {
        return next(err);
      }

      return res.redirect('/users/' + newUser.username);
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
