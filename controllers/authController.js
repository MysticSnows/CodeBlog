require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
// Mixpanel utility to track user logins data
const mixpanel = require('../utils/mixpanel');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, password, nickname } = req.body;
        //nickname should not be 'Deleted User'
        if (nickname === 'Deleted User' || nickname === 'DeletedUser') {
            res.status(400).redirect('/login', { msg: 'Username as "Deleted User" is not allowed\nPlease try some other username!' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the new user
        const user = await User.create({
            username: username,
            nickname: nickname,
            password: hashedPassword
        });
        console.log("Registered User: ", user);
        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('login', { msg: 'Unable to register new user. Possibility of being already registered' });
    }
};

// Login Existing user
exports.login = async (req, res, next) => {

    const passport = req.app.get('passport');
    const signToken = req.app.get('signToken');
    passport.authenticate('local', { session: true }, async (err, user, info) => {
        if (err || !user) {
            return res.status(401).render('login', { msg: 'Invalid email or password.' });
        }
        // Check if user is deleted
        if (user.isDeleted) {
            return res.status(400).render('login', { msg: 'This account does no longer exist' });
        }
        // Check if user is banned
        if (user.isBanned) {
            return res.status(403).render('login', { msg: 'You were banned by an Admin' });
        }
        // User is authenticated
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            // Update lastVisit property
            try {
                const userId = req.user._id;
                const user = await User.findById(userId);
                user.lastVisit = new Date();
                await user.save();
                // create or update a user in Mixpanel Engage
                mixpanel.people.set(userId, {
                    $distinct_id: userId,
                    $email: user.username
                });
                // send login event to mixpanel server
                mixpanel.track('Logged In', {
                    'Login': user.lastVisit,
                    'email': user.username
                });
            } catch (err) {
                console.log("authController: ", err);
                res.redirec('/login');
            }
            // Generate JWT token and return it to client
            const token = signToken(user);
            res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
            res.redirect('/');
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

