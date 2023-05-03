const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LocalStrategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        console.log(user);
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

// JWT sign
const signToken = (user) => {
    const payload = {
        _id: user._id,
        username: user.username
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { passport, signToken };
