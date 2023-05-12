
module.exports = (req, res, next) => {
    if(req.user.isAdmin && !req.user.isBanned){
        return next();
    } else {
        res.redirect('/');
    }
}