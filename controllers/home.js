var Group = require('../models/Group');


/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

  if (req.user) {
    Group.list({ criteria: { 'members': req.user._id } }, function (err, userGroups) {
      if (err) return next(err);
      res.render('dashboard/dashboard', {
        title: 'Dashboard',
        userGroups: userGroups
      });
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