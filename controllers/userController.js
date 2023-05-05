// User profile management
// Password reset
// User authorization

// TEST
exports.profile = (req, res) => {
    res.render('profile', {user: 
        req.user.username
    });
    // res.send(`Hello ${req.user.username}!`);
};


exports.login = (req, res) => {
    res.render('login');
}

exports.register = (req, res) => {
    res.render('register');
}

