var mongoose = require('mongoose');
var Match = require('../models/Match');
var Tip = require('../models/Tip');
var Team = require('../models/Team');

var passportConf = require('../config/passport');

'use strict';


exports.load = function(req, res, next, id) {
  Match.load(id, function (err, match) {
    if (err) return next(err);
    if (!match) return next(new Error('not found'));
    req.match = match;
    next();
  });
}

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Match.count();
  var perPage = 20;
  var page = req.query.page || 1;

  var options = {
    order: {
      'when': '1'
    }
  };



  Match.list(options, function (err, _matches) {
    if (err) return next(err);

    // map user's tips to matches
    if (req.user) {
      Tip.getUserTips(req.user, function(err, tips) {
        if (err) {
          next(err);
        } else {
          console.log('current user has ' + tips.length + ' tips');
          _matches.forEach(function(match) {
            for (var i = 0; i < tips.length; i++) {
              if (match._id.equals(tips[i].match._id)) {
                console.log('found user tip');
                console.dir(tips[i]);
                match.userTip = tips[i];
                break;
              } else {
                match.userTip = null;
              }
            }
          });
          console.dir(_matches);
          res.render('match/index.jade', {
            title: 'Alle Partien',
            matches: _matches
          });
        }
      });
    }
    // just render without user tips
    else {
      res.render('match/index.jade', {
        title: 'Alle Partien',
        matches: _matches
      });
    }
  });
}


exports.new = function (req, res, next) {

  Team.list({}, function (err, _teams) {

    if (err) return next(err);

    res.render('match/new.jade', {
      title: "Neue Partie erstellen",
      match: new Match({}),
      teams: _teams
    });

  });

}

exports.edit = function (req, res, next) {

  var match = req.match;
  console.dir(match);

  Team.list({}, function (err, _teams) {
    if (err) return next(err);

    res.render('match/edit.jade', {
      title: "Partie bearbeiten",
      match: match,
      teams: _teams
    });

  });
}


exports.create = function (req, res, next) {

  console.log('creating new match:');
  console.dir(req.body);

  var match = new Match(req.body);
  match.founder = req.user;

  var newMatch = new Match(req.body);

  newMatch.save(function(err, match) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Partie wurde erstellt.' });
    return res.redirect('/matches');
  });
}


/**
 *  Get match by id
 */
exports.show = function (req, res, next) {
  var match = req.match;

  // TODO: render correctly

  if(!match) {
    req.flash('error', { msg: 'Dieses Match existiert nicht.' });
    res.redirect('/matchs');
  } else {
    res.render('match/show.jade', {
      title: 'Match Details',
      match: req.match
    });
  }

};

/**
 *  Delete Match
 */
exports.delete = function (req, res, next) {

  var match = req.match;

  match.remove(function (err) {
    if (err) return next(err);

    res.send(200, 'Match removed');
  });
};

/**
 * Update Match
 */
exports.update = function (req, res, next) {

  var match = req.match;

  console.dir(req.body);

  match.set(req.body);

  match.save(function(err, match) {
    if (!err) {
      console.log('update successful');
      return res.send(match);
    } else {
      return next(err);
    }
  });

};

