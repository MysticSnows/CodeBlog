require('dotenv').config();
// passport-config.js
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function (app) {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // LocalStrategy
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            // Find the user by username
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Invalid username' });
            }
            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        } catch (err) {
            done(err);
        }
    }));

    // Serialize
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    // Deserialize
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((founduser) => {
                done(null, founduser);
            })
            .catch(err => {
                done(err);
            });
    });


    // JWT sign
    const signToken = (user) => {
        const payload = {
            _id: user._id,
            username: user.username,
            nickname: user.nickname
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    };


    return {
        passport,
        signToken
    };
};
