const User = require('../models/user');
const Article = require('../models/posts');

exports.endPoint = async (req, res) => {
    if(req.user && req.user.isAdmin){
        try {
            const total_post_cnt = await Article.find().count();
            const total_user_cnt = await User.find().count();
            const today = new Date();
            today.setHours(0,0,0,0); // set the time to the start of the day
            const today_post_cnt = await Article.find({createdAt: {$gte: today}}).count();
            const new_user_cnt = await User.find({createdAt: {$gte: today}}).count();
            res.render('dashboard/adminDash', {total_post_cnt:total_post_cnt, total_user_cnt:total_user_cnt,
            today_post_cnt:today_post_cnt, new_user_cnt:new_user_cnt });

        } catch(err) {
            console.log("Error in dashboardController!: ", err);
            res.redirect('/');
        }

    } else {
        res.send("Hello User");
    }

}