const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { authMiddleware } = require('../middlewares/authMiddleware');


// endpoint: /...

router.get('/profile', authMiddleware, userController.profile);
router.get('/login', userController.login);
router.get('/register', userController.register);



module.exports = router;