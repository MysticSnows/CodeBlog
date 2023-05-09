const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// endpoint: /dashboard/...

router.get('', authMiddleware, dashboardController.endPoint);   

module.exports = router;