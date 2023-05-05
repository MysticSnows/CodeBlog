const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { authenticateToken, isAuthenticated } = require('../middlewares/authUser');

// endpoint: /...

// router.get('/profile', [authenticateToken, isAuthenticated], userController.profile);
router.get('/profile', isAuthenticated, userController.profile);
router.get('/login', userController.login);
router.get('/register', userController.register);



module.exports = router;