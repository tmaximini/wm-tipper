var mongoose = require('mongoose');
var Match = require('../models/Match');
var Tip = require('../models/Tip');
var Team = require('../models/Team');
var User = require('../models/User');

var async = require('async');

var utils = require('../helpers/utils');

var passportConf = require('../config/passport');

// child process, allow only 1 at a time
var childProcess, timeout;

'use strict';


exports.load = function(req, res, next, id) {
  Match.load(id, function (err, match) {
    if (err) return next(err);
    if (!match) return next(new Error('not found'));
    req.match = match;
    next();
  });
}


exports.index = function(req, res, next) {

  var options = {
    orderBy: {
      'when': '1'
    },
    criteria: {
      'isDummy': false
    }
  };


  // show dummy matches to admins
  if (req.user && req.user.admin) {
    options.criteria = {};
  }

  Match.list(options, function (err, _matches) {
    if (err) return next(err);

    return res.render('match/index.jade', {
      title: 'Alle Partien',
      matches: _matches
    });
  });
}


exports.groupIndex = function (req, res, next) {

  var options = {
    orderBy: {
      'when': '1'
    },
    criteria: {
      'isDummy': false
    }
  };
  // show dummy matches to admins
  if (req.user && req.user.admin) {
    options.criteria = {};
  }

  if (req.user && (utils.userInGroup(req.user, req.group) || req.user.admin)) {
    Match.list(options, function (err, _matches) {
      if (err) return next(err);
      // map user's tips to matches
      if (req.user && req.group) {
        // console.log('current user has ' + req.user.tips.length + ' tips');
        _matches.forEach(function(match) {
          for (var i = 0; i < req.user.tips.length; i++) {
            var tip = req.user.tips[i];
            if ((match._id.equals(tip.match)) && (req.group._id.equals(tip.group))) {
              //console.dir(tip);
              match.userTip = tip;
              match.userTipPoints = utils.getPoints(match, match.userTip);
              break;
            } else {
              match.userTip = null;
              match.userTipPoints = null;
            }
          }
        });
        res.render('match/groupIndex.jade', {
          title: req.group.name + ' - Spielübersicht',
          matches: _matches,
          group: req.group
        });


      }
      // just render without user tips
      else {
        return res.redirect('/plan');
      }
    });
  } else {
    return res.redirect('/plan');
  }
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

  if(!match) {
    req.flash('error', { msg: 'Dieses Match existiert nicht.' });
    res.redirect('/matches');
  } else {

    res.render('match/show.jade', {
      title: 'Match Details',
      match: req.match,
      matchUsers: []
    });
  }
};


/**
 *  Get match by id
 */
exports.showGroupTip = function (req, res, next) {
  var match = req.match;
  var userTip = null;
  var group = req.group;

  var matchUsers = [];


  if(!match) {
    req.flash('error', { msg: 'Dieses Match existiert nicht.' });
    res.redirect('/matches');
  } else {

    for (var i = 0; i < req.user.tips.length; i++) {
      if (match._id.equals(req.user.tips[i].match)) {
        userTip = req.user.tips[i];
        break;
      }
    }

    if (match.isKo() && match.started) {
      group.members.forEach(function(member) {
        for (var i = 0; i < member.tips.length; i++) {
          if (match._id.equals(member.tips[i].match)) {
            var user = { name: member.profile.name, image: member.profile.picture ? member.profile.picture.replace('large', 'small', 'g') : member.gravatar() }
            user.tip = member.tips[i];
            user.points = utils.getPoints(req.match, user.tip)
            matchUsers.push(user);
            break;
          }
        }
      });
      console.dir('FINISHED FOR EACH', matchUsers);
    }

    res.render('match/show.jade', {
      title: 'Match Details',
      match: req.match,
      userTip: userTip,
      group: group,
      matchUsers: matchUsers,
      points: !userTip ? null : utils.getPoints(req.match, userTip)
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
    req.flash('success', { msg: 'Partie wurde gelöscht.' });
    return res.redirect('/matches');
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
      req.flash('success', { msg: 'Partie wurde aktualisiert.' });
      res.redirect('/matches');


      // if there is already an child process running, kill it first
      if (childProcess && childProcess.kill) {
        childProcess.kill('SIGINT');
        clearTimeout(timeout);
      }

      var fork = require('child_process').fork;
      childProcess = fork('./helpers/updateHelper.js', function(err, stdout, stderr) {
        //User.updateCurrentPoints();
        if (err) console.error(err);
        console.log('forked');
      });

      // kill childProcess after 5 minutes
      timeout = setTimeout(function() {
        childProcess.kill('SIGINT');
        childProcess = undefined;
      }, 300000);

      childProcess.on('exit', function() { console.log('child process terminated!'); });

    } else {
      return next(err);
    }
  });

};

/**
 *  Delete Match
 */
exports.delete = function (req, res, next) {
  var match = req.match;

  match.remove(function (err) {
    if (err) return next(err);
    // remove also all tips for this match
    Tip.find({ match: match }).remove(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Das Spiel wurde gelöscht' });
      res.redirect('/matches');
    });
  });
};

