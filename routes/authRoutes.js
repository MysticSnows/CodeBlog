const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// endpoint: /auth/...

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);


module.exports = router;
