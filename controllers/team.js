var mongoose = require('mongoose');
var Team = require('../models/Team');
var Match = require('../models/Match');

var passportConf = require('../config/passport');

'use strict';

exports.load = function(req, res, next, id) {
  Team.load(id, function (err, team) {
    if (err) return next(err);
    req.team = team;
    next();
  });
}

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Team.count();
  var perPage = 10;
  var page = req.query.page || 1;

  var condition = {
    isDummy: false
  };

  // show dummy teams to admins
  if (req.user && req.user.admin) {
    condition = {};
  }

  Team.list({ criteria: condition }, function (err, _teams) {
    if (err) return next(err);

    res.render('team/index.jade', {
      title: 'Alle Mannschaften',
      teams: _teams
    });

  });
}


exports.new = function (req, res, next) {
  res.render('team/new.jade', {
    title: "Create Team",
    team: new Team({})
  });
}

exports.edit = function (req, res, next) {
  res.render('team/edit.jade', {
    title: "Edit Team",
    team: req.team
  });
}


exports.create = function (req, res, next) {

  var newTeam = new Team(req.body);

  newTeam.save(function(err, team) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Mannschaft wurde erstellt.' });
    return res.redirect('/teams');
  });
}


/**
 *  Get team by id
 */
exports.show = function (req, res, next) {
  var team = req.team;
  if(!team) {
    req.flash('error', { msg: 'Dieses Team existiert nicht.' });
    res.redirect('/teams');
  } else {

    Match.list({ criteria: { $or: [{ team1: team }, { team2: team}]} }, function(err, teamMatches) {
      if (err) next(err);
      res.render('team/show.jade', {
        title: 'Match Details',
        team: team,
        teamMatches: teamMatches
      });
    });

  }
};


/**
 * Update Team
 */
exports.update = function (req, res, next) {

  var team = req.team;

  console.dir(req.body);

  team.set(req.body);

  team.save(function(err, team) {
    if (!err) {
      console.log('update successful');
      return res.redirect('/teams');
    } else {
      return next(err);
    }
  });

};


/**
 *  Delete Team
 */
exports.delete = function (req, res, next) {
  var team = req.team;

  team.remove(function (err) {
    if (err) return next(err);
    req.flash('success', { msg: 'Das Team wurde gelöscht' });
    res.redirect('/teams');
  });
};