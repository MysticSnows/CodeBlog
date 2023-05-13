const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
// endpoint: /dashboard/...

router.get('', authMiddleware, dashboardController.default);
router.get('/manage-posts', authMiddleware, isAdmin, dashboardController.managePosts);
router.get('/manage-posts/edit/:id', authMiddleware, isAdmin, dashboardController.editView);
router.get('/manage-users', authMiddleware, isAdmin, dashboardController.manageUsers);

// edit article
router.put('/manage-posts/edit/:id', authMiddleware, isAdmin, dashboardController.editArticle);

// delete article
router.delete('/manage-posts/delete/:id', authMiddleware, isAdmin, dashboardController.deleteArticle);

// publish / unpublish
router.post('/manage-posts/publishToggle', authMiddleware, isAdmin, dashboardController.publishToggle);


// make admin / user
router.post('/manage-users/adminToggle', authMiddleware, isAdmin, dashboardController.adminToggle);

// DELETE User
// router.delete('/manage-users/deleteUser', authMiddleware, isAdmin, dashboardController.deleteUser);
router.post('/manage-users/deleteUser', authMiddleware, isAdmin, dashboardController.deleteUser);

// Ban / Unban User
router.post('/manage-users/banToggle', authMiddleware, isAdmin, dashboardController.banToggle);

module.exports = router;