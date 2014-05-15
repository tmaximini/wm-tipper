var User = require('../models/User');


/**
 * GET /top
 * Top 10 page.
 */

exports.index = function(req, res) {

  User.list({}, function(err, users) {
    if (err) return next(err);
    console.dir(users);

    res.render('top/index', {
      title: 'Bestenliste',
      users: users
    });
  });

};
