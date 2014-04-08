var mongoose = require('mongoose');
var Team = require('../models/Team');

var passportConf = require('../config/passport');

'use strict';

exports.load = function(req, res, next, id) {
  Team.load(id, function (err, team) {
    if (err) return next(err);
    if (!team) return next(new Error('not found'));
    req.team = team;
    next();
  });
}

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Team.count();
  var perPage = 10;
  var page = req.query.page || 1;

  Team.list({}, function (err, _teams) {
    if (err) return next(err);

    res.render('team/index.jade', {
      title: 'Alle Gruppen',
      teams: _teams
    });

  });
}


exports.new = function (req, res, next) {
  res.render('team/new.jade', {
    title: "Create Team",
    team: new Team({})
  });
  console.dir(res.locals);
}

exports.edit = function (req, res, next) {
  res.render('team/edit.jade', {
    title: "Edit Team",
    team: req.team
  });
  console.dir(res.locals);
}


exports.create = function (req, res, next) {

  console.log('creating new team:');
  console.dir(req.body);
  console.log('current user:');
  console.dir(req.user);

  var team = new Team(req.body);
  team.founder = req.user;

  var newTeam = new Team(req.body);

  // generate slug from title
  // newStory.slug = utils.convertToSlug(newStory.title);

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
    res.send(404, 'TEAM_NOT_FOUND');
  } else {
    res.send(team);
  }

};

/**
 *  Delete team
 */
exports.delete = function (req, res, next) {

  var team = req.team;

  team.remove(function (err) {
    if (err) return next(err);

    res.send(200, 'Team removed');
  });
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
      return res.send(team);
    } else {
      return next(err);
    }
  });

};