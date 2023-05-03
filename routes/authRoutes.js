const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.use(express.json());
// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// router.get('/profile', authController.profile);


module.exports = router;
