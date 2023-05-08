const mongoose = require('mongoose');
const User = require('./user');
const { marked } = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const hljs = require('highlight.js');


marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, language) {
        const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
        return hljs.highlight(code, { language: validLanguage }).value;
    },
    langPrefix: 'hljs language-'
});



const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ckEditor: {
        type: String,
        // required: true
    }
})

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (typeof this.markdown !== 'undefined') {
        // convert markdown to html and purifies the html to avoid malicious html code execution
        console.log("markdown:", this.ckEditor)
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    } else if (this.ckEditor !== '') {
        console.log("CkEditor:", this.ckEditor)
        this.sanitizedHtml = dompurify.sanitize(this.ckEditor)
    }

    // if (this.ckEditor) {
    //     this.sanitizedHtml = dompurify.sanitize(this.ckEditor)
    // } 


    next()
})

module.exports = mongoose.model('Article', articleSchema);