const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

// endpoint: /articles/...

router.get('/create', articlesController.create);
router.get('/myArticles', articlesController.myArticles);   // should come before /:slug
router.get('/search', articlesController.searchArticle);

// /articles/somePath: should come before this endpoint of /articles/:slug
router.get('/:slug', articlesController.showArticle);


// Post req
router.post('/createArticle', articlesController.createArticle);

// Delete req
router.delete('/:id', articlesController.deleteArticle);

// Edit
router.get('/edit/:id', articlesController.edit);
router.put('/:id', articlesController.editArticle)

module.exports = router;