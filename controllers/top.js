var User = require('../models/User');
var utils = require('../helpers/utils');

/**
 * GET /top
 * Top 10 page.
 */

exports.index = function(req, res) {

  User.list({}, function(err, users) {
    if (err) return next(err);

    var sortedUsers = utils.sortUsersByPoints(users);

    res.render('top/index', {
      title: 'Bestenliste',
      users: sortedUsers
    });

  });

};
