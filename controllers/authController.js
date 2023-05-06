
const bcrypt = require('bcrypt');
const User = require('../models/user');

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
        console.log("Registered User: ", user);
        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to register new user. Possibility of being already registered' });
    }
};

// Login Existing user
exports.login = async (req, res, next) => {
    const passport = req.app.get('passport');
    const signToken = req.app.get('signToken');
    passport.authenticate('local', { session: true }, async (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // User is authenticated
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Generate JWT token and return it to client
            const token = signToken(user);
            res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
            res.redirect('/profile');
        });
    })(req, res, next);
};

// Logout
exports.logout = (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
    res.clearCookie('token');
};

