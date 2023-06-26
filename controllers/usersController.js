// controllers/userController.js
const User = require('../models/user');

exports.fetchAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findByName = async (req, res) => {

  const username = req.params.username;
  const user = await User.findOne(username);

  if (user) {
    res.render('private/user', { user: user });
  } else {
    res.status(404).send('User not found');
  }
}

