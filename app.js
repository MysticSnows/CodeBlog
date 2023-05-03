require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');

const app = express();

const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
}
connectDB().then(()=>console.log("Database Connected")).catch(()=>console.log("Error connecting DB"));

app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
