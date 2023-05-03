
const { passport, signToken } = require('../passport-config/passport-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const authenticateToken = require('../middleware/authToken');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the new user
        const user = await User.create({
            username: username,
            password: hashedPassword
        });
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to register new user' });
    }
};

// Login Existing user
exports.login = async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // User is authenticated
        // Generate JWT token and return it to client
        const token = signToken(user);
        res.json({ token });
    })(req, res, next);
};

// Logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

// TEST
exports.profile = [
    authenticateToken,
    (req, res) => {
        res.send(`Hello ${req.user.username}!`);
    }
];

