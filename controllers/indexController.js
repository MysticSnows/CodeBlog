const Article = require('../models/posts');

module.exports = async(req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render('articles/index', {articles: articles});
}