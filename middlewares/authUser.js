const jwt = require('jsonwebtoken');

// Autenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log("User not Authenticated / Token Missing");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Check if user already authenticated
isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated: ", req.isAuthenticated());
  console.log("req.user: ", req.user);
  if (req.user || req.isAuthenticated()) {
      return next();
  }

  res.redirect('/login');
};

module.exports = {authenticateToken, isAuthenticated};