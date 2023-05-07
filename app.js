require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { passport, signToken } = require('./middlewares/passport-config')(app);
// Including Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const indexRouter = require('./routes/indexRoute');
const postRouter = require('./routes/articlesRoutes');

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(express.static("public"));
app.use(methodOverride('_method'));     // required for DELETE

// Connect to MongoDB
const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
}
connectDB().then(() => console.log("Database Connected")).catch(() => console.log("Error connecting DB"));


app.set('passport', passport);
app.set('signToken', signToken);


app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

// Use cookie-parser middleware
app.use(cookieParser());


// Middleware function that sets the req.user object as a local variable for all views
app.use(function (req, res, next) {
    if (req.cookies.token) {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.currentUser = decoded;
    }
    res.locals.currentUser = req.user;
    next();
});


// Use exported Routes
app.use('/auth', authRouter);
app.use(userRouter);
app.use(indexRouter);
app.use('/articles', postRouter);


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
