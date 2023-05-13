const User = require('../models/user');
const Article = require('../models/posts');
const mixpanel = require('../utils/mixpanel');
const moment = require('moment');

/*
  toRender: '.ejs filename inside dashboard/admin folder to update view'
*/

//////    Default Dashboard View    //////
exports.default = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    try {
      const total_post_cnt = await Article.find().count();
      const total_user_cnt = await User.find().count();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // set the time to the start of the day
      const today_post_cnt = await Article.find({ createdAt: { $gte: today } }).count();
      const new_user_cnt = await User.find({ createdAt: { $gte: today } }).count();


      // get the start of the current week
      const startOfWeek = moment().startOf('week');
      // get the end of the current week
      const endOfWeek = moment().endOf('week');
      const weekly_post_cnt = [0, 0, 0, 0, 0, 0, 0]; // initialized array with 0s for each day of the week
      const results = await Article.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfWeek.toDate(),
              $lte: endOfWeek.toDate()
            }
          }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$createdAt' }, // group by day of the week
            count: { $sum: 1 } // count the number of posts for each day
          }
        }
      ])
        .then((results) => {
          results.forEach((result) => {
            const dayOfWeek = result._id - 1; // get the day of the week (0-based index)
            weekly_post_cnt[dayOfWeek] = result.count; // set the count at the corresponding index
          });
        });


      res.render('dashboard/adminDash', {
        toRender: '_dashboard', pageName: 'Dashboard',
        total_post_cnt: total_post_cnt, total_user_cnt: total_user_cnt,
        today_post_cnt: today_post_cnt, new_user_cnt: new_user_cnt,
        weekly_post_cnt: weekly_post_cnt
      });

    } catch (err) {
      console.log("Error in dashboardController!: ", err);
      res.redirect('/');
    }

  } else {
    res.send("Hello User");
  }

};




//////    View    //////
exports.managePosts = async (req, res) => {
  const articles = await Article.find({}).populate('author', 'username nickname isAdmin isBanned isDeleted createdAt lastVisit').sort({ createdAt: 'desc' });
  res.render('dashboard/adminDash', {
    toRender: '_manage-posts', pageName: 'Manage Posts',
    articles: articles
  });
};




//////    View    //////
exports.editView = async (req, res) => {
  const article = await Article.findById(req.params.id);
  console.log(req.params.id)
  res.render('dashboard/adminDash', {
    toRender: '_edit-article', pageName: 'Edit Article',
    article: article
  });
}

// PUT
// edit article endpoint: PUT /dashboard/manage-posts/edit/:id
exports.editArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  // const articles = await Article.find({}).populate('author', 'username nickname isAdmin isBanned createdAt lastVisit').sort({createdAt: 'desc'});

  article.title = req.body.title;
  article.description = req.body.description;
  if (req.body.ckEditor != '') {
    article.markdown = undefined;
    article.ckEditor = req.body.ckEditor;
  }
  else if (req.body.markdown != '') {
    article.ckEditor = undefined;
    article.markdown = req.body.markdown;
  }
  try {
    article = await article.save();
    res.render('/dashboard/manage-posts');
  } catch (e) {
    res.redirect('/dashboard/manage-posts');
  }

};

// DELETE
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log("Error in deleteArticle Controller", err);
  }
  res.redirect('/dashboard/manage-posts');
};

// Publish / Unpublish
exports.publishToggle = async (req, res) => {
  try {
    const article = await Article.findById(req.body.id);
    (article.published === true) ? (article.published = false) : (article.published = true);
    article.save();
  } catch (err) {
    console.log("error in PublishToggle Controller", err);
  }
  res.redirect('/dashboard/manage-posts');
};




/////////////////////////             Manage Users             /////////////////////////
//////    View    //////
exports.manageUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: 'desc' });
  res.render('dashboard/adminDash', {
    toRender: '_manage-users', pageName: 'Manage Users',
    users: users
  });
};


exports.adminToggle = async (req, res) => {
  const user = await User.findById(req.body.id);
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.redirect('/dashboard/manage-users');
}


exports.deleteUser = async (req, res) => {
  // try {
  //   await User.findByIdAndDelete(req.body.id);
  // } catch (err) {
  //   console.log("Error in deleteUser Controller", err);
  // }
  // res.redirect('/dashboard/manage-users');
  const user = await User.findById(req.body.id);
  user.isDeleted = true;
  await user.save();
  res.redirect('/dashboard/manage-users');
  
}


exports.banToggle = async (req, res) => {
  const user = await User.findById(req.body.id);
  user.isBanned = !user.isBanned;
  await user.save();
  res.redirect('/dashboard/manage-users');
}