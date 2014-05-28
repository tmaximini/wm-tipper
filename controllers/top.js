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

  User.list({}, function(err, users) {
    if (err) return next(err);

    var promises = [];

    users.forEach(function(usr) {
      promises.push(usr.getTotalPoints().then(function(points) {
        console.log('resolved points for ' + usr.profile.name +': ' + points);
        usr.currentPoints = points;
      }));
    });

    Promise.all(promises).then(function() {

      var sortedUsers = _.sortBy(users, function(user) {
        return -user.currentPoints;
      });

      console.log('all promsises in top contoroller resolved');

      res.render('top/index', {
        title: 'Bestenliste',
        users: sortedUsers
      });
    });

  });

};
