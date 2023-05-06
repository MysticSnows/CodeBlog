const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Autenticate Token
//  function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     console.log("User not Authenticated / Token Missing");
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.user = user;
//     next();
//   });
// } 

//Authenticate Token
authMiddleware = async (req, res, next) => {
  // Check if user is authenticated with session
  if (req.isAuthenticated()) {
    return next();
  }

  // Check if user is authenticated with token
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Neither session nor token authentication succeeded
  res.redirect('/login');
};


module.exports = { authMiddleware };