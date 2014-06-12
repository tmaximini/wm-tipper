var Group = require('../models/Group');
var Match = require('../models/Match');
var News = require('../models/News');


/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

  var hour = 3600000;

  if (req.user) {
    Group.list({ criteria: { 'members': req.user._id } }, function (err, userGroups) {
      if (err) return next(err);


      var matchOptions = {
        orderBy: {
          when: 1
        },
        criteria: {
          when: {
            $gt: Date.now() - 1.76*hour
          }
        },
        limit: 4
      };

      Match.count({}, function( err, totalMatchCount){
        Match.list(matchOptions, function(err, nextMatches) {
          if (err) return next(err);
          News.list({ criteria: { 'published': true }, orderBy: { 'createdAt': -1 }, perPage: 4 }, function(err, latestNews) {
            if (err) return next(err);
            res.render('dashboard/dashboard', {
              title: 'Dashboard',
              userGroups: userGroups,
              nextMatches: nextMatches,
              totalMatchCount: totalMatchCount,
              latestNews: latestNews,
              tipCount: req.user.tips.length
            });
          });
        });
      });
    });
  } else {

    var matchOptions = {
      orderBy: {
        when: 1
      },
      criteria: {
        when: {
          $gt: Date.now() - 1.76*hour
        }
      },
      limit: 4
    };

    Match.count({}, function( err, totalMatchCount){
      Match.list(matchOptions, function(err, nextMatches) {
        if (err) return next(err);
        News.list({ criteria: { 'published': true }, orderBy: { 'createdAt': -1 }, perPage: 4 }, function(err, latestNews) {
          if (err) return next(err);
          res.render('home', {
            title: 'Das WM-Tippspiel zur Fussball Weltmeisterschaft 2014 in Brasilien',
            nextMatches: nextMatches,
            totalMatchCount: totalMatchCount,
            latestNews: latestNews
          });
        });
      });
    });
  }
};

exports.privacy = function(req, res) {
  res.render('static/privacy', {
    title: 'Datenschutz'
  });
};

exports.rules = function(req, res) {
  res.render('static/rules', {
    title: 'Regeln'
  });
};

exports.impressum = function(req, res) {
  res.render('static/impressum', {
    title: 'Impressum'
  });
};