const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// endpoint: /articles/...

router.get('/create', authMiddleware, articlesController.create);
router.get('/myArticles', articlesController.myArticles);   // should come before /:slug
router.get('/search', articlesController.searchArticle);

// /articles/somePath: should come before this endpoint of /articles/:slug
router.get('/:slug', articlesController.showArticle);


// Post req
router.post('/createArticle', authMiddleware, articlesController.createArticle);

// Delete req
router.delete('/:id', authMiddleware, articlesController.deleteArticle);

// Edit
router.get('/edit/:id', authMiddleware, articlesController.edit);
router.put('/:id', authMiddleware, articlesController.editArticle)

module.exports = router;