var User = require('../models/User');
var Group = require('../models/Group');
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

    User.find().sort('-maxPoints').skip((page -1) * perPage).limit(perPage).exec(function(err, sortedUsers) {
      if (err) return next(err);

      sortedUsers.forEach(function(usr) {
        if (usr.groups.length > 1) {
          var bestGroupIndex = usr.groupPoints.indexOf(usr.maxPoints);
          if (bestGroupIndex !== -1) {
            usr.bestGroup = usr.groupStats[bestGroupIndex];
            usr.nrOfTips = usr.numberOfTipsInGroup(usr.groups[bestGroupIndex]);
            //Group.findOne(usr.groups[bestGroupIndex], function(err, group) {
            //  usr.bestGroupDetails = group;
            //});
          }
        } else {
          if (usr.groupStats[0]) {
            usr.bestGroup = usr.groupStats[0];
            //Group.findOne(usr.groups[0], function(err, group) {
            //  usr.bestGroupDetails = group;
            //});
          } else {
            usr.bestGroup = { total: 0, correct: 0, tendency: 0, wrong: 0 };
          }
          usr.nrOfTips = usr.tips.length;
        }
      });




      // do something with sorted users

      res.render('top/index', {
        title: 'Bestenliste',
        sortedUsers: sortedUsers,
        page: page,
        perPage: perPage,
        totalCount: totalCount
      });

    });

  });



};
