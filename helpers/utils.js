var _ = require('lodash');
var Match = require('../models/Match');
var Promise = require('bluebird');


exports.convertToSlug = function (text) {
  return text
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
};


exports.getTipPointsPromise = function(tip) {
  var qIn = Promise.defer();
  var self = this;
  Match.load(tip.match, function(err, match) {
    if (err) console.error(err); // log only for now
    if (match && match.started) {
      console.log('tipped match found and started');
      var points = self.getPoints(match, tip);
      qIn.resolve(points);
    } else {
      qIn.resolve(-1);
    }
  });
  return qIn.promise;
};


exports.userInGroup = function (user, group) {
 return user.groups.some(function (userGroup) {
    return userGroup.equals(group._id);
  });
};


exports.getPoints = function(match, tip) {
  var points = 0;
  var st1 = match.scoreTeam1;
  var st2 = match.scoreTeam2;

  if ((st1 === tip.scoreTeam1) && (st2 === tip.scoreTeam2)) {
    points = 3;
  } else {

      if ((tip.bet === 'X' && (st1 === st2)) ||
          (tip.bet === '1' && (st1 > st2)) ||
          (tip.bet === '2' && (st1 < st2))) {
        points = 1;
      }
  }
  return points;
};



exports.sortUsersByPoints = function(users, group) {
  return _.sortBy(users, function(user) {
    if (group) {
      return -user.totalPointsPerGroup(group);
    } else {
      return -user.totalPointsAllGroups();
    }

  });
}