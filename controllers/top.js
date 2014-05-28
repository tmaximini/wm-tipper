var User = require('../models/User');
var utils = require('../helpers/utils');
var Promise = require('bluebird');
var _ = require('lodash');

/**
 * GET /top
 * Top 10 page.
 */

exports.index = function(req, res) {

  var perPage = 10;
  var page = req.query.page || 1;

  User.count({}, function(err, totalCount) {

    User.find().sort('-totalPoints').skip((page -1) * perPage).limit(perPage).exec(function(err, sortedUsers) {
      if (err) return next(err);

      res.render('top/index', {
        title: 'Bestenliste',
        users: sortedUsers,
        page: page,
        perPage: perPage,
        totalCount: totalCount
      });

    });

  });



};
