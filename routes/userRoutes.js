// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const User = require('../models/user');
const UsersController = require('../controllers/usersController');

router.get('/:username', ensureAuthenticated, UsersController.findByName);
router.get('/', ensureAuthenticated, UsersController.fetchAll);

module.exports = router;
