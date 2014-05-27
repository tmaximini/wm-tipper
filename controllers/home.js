var Group = require('../models/Group');
var Match = require('../models/Match');
var Promise = require('bluebird');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

  if (req.user) {
    Group.list({ criteria: { 'members': req.user._id } }, function (err, userGroups) {
      if (err) return next(err);

      var matchOptions = {
        orderBy: {
          when: 1
        },
        criteria: {
          when: {
            $gt: Date.now()
          }
        },
        limit: 4
      };

      Match.count({}, function(err, totalMatchCount){
        Match.list(matchOptions, function(err, nextMatches) {
          if (err) return next(err);

          var promises = [];

          nextMatches.forEach(function(match) {
            promises.push(req.user.getTipsForMatch(match._id).then(function(resolvedTips) {
              console.log('resolved tips', resolvedTips);
              match.userTips = resolvedTips;
            }));
          });

          Promise.all(promises).then(function() {

            //console.log('all resolved bruder', nextMatches);

            res.render('dashboard/dashboard', {
              title: 'Dashboard',
              userGroups: userGroups,
              nextMatches: nextMatches,
              totalMatchCount: totalMatchCount,
              tipCount: req.user.tips.length
            });
          });

        });
      })
    });
  } else {
    res.render('home', {
      title: 'Das Tippspiel zur Fussball Weltmeisterschaft 2014 in Brasilien'
    });
  }
};

exports.privacy = function(req, res) {
  res.render('static/privacy', {
    title: 'Datenschutz'
  });
};

exports.impressum = function(req, res) {
  res.render('static/impressum', {
    title: 'Impressum'
  });
};