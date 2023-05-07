
const Article = require('../models/posts');
const User = require('../models/user');

exports.create = (req, res) => {
    res.render('articles/create', { article: new Article() });
};

exports.showArticle = async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug }).populate('author', 'username _id');
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article });
};

exports.edit = async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
};

exports.myArticles = async (req, res) => {
    const myArticles = await Article.find({ author: req.user._id }).populate('author', 'username _id');
    res.render('articles/index', { articles: myArticles });
};

exports.searchArticle = async (req, res) => {
    const query = req.query.query;
    try {
        const articles = await Article.find({ title: { $regex: query, $options: 'i' } });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error performing search:', err);
    }
};



// POST
// create article endpoint: POST /articles/create
exports.createArticle = [async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('create')];

// PUT
// edit article endpoint: PUT /articles/:id
exports.editArticle = [async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit')];


// DELETE
exports.deleteArticle = async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
};


// middleware for POST and PUT Article
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.author = req.user._id;
        article.ckEditor = req.body.ckEditor;
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}
