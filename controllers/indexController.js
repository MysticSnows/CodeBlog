const Article = require('../models/posts');

module.exports = async(req, res) => {
    const articles = await Article.find().populate('author', 'username _id').sort({createdAt: 'desc'});
    res.render('articles/index', {articles: articles});
}