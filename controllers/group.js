var mongoose = require('mongoose');
var Group = require('../models/Group');

var passportConf = require('../config/passport');

'use strict';


exports.load = function(req, res, next, id) {
  Group.load(id, function (err, group) {
    if (err) return next(err);
    if (!group) return next(new Error('not found'));
    req.group = group;
    next();
  });
}

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Group.count();
  var perPage = 10;
  var page = req.query.page || 1;

  Group.list({}, function (err, _groups) {
    if (err) return next(err);

    res.render('group/index.jade', {
      title: 'Alle Gruppen',
      groups: _groups
    });

  });
}


exports.new = function (req, res, next) {
  res.render('group/new.jade', {
    title: "Create Group",
    group: new Group({})
  });
  console.dir(res.locals);
}

exports.edit = function (req, res, next) {
  res.render('group/edit.jade', {
    title: "Edit Group",
    group: req.group
  });
  console.dir(res.locals);
}


exports.create = function (req, res, next) {

  console.log('creating new group:');
  console.dir(req.body);
  console.log('current user:');
  console.dir(req.user);

  var group = new Group(req.body);
  group.founder = req.user;

  var newGroup = new Group(req.body);

  newGroup.save(function(err, group) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Gruppe wurde erstellt.' });
    return res.redirect('/groups');
  });
}


/**
 *  Get group by id
 */
exports.show = function (req, res, next) {
  var group = req.group;

  // TODO: render correctly

  if(!group) {
    req.flash('error', { msg: 'Diese Gruppe existiert nicht.' });
    res.redirect('/groups');
  } else {
    res.render('group/show.jade', {
      title: req.group.name,
      group: req.group
    });
  }

};

/**
 *  Delete Group
 */
exports.delete = function (req, res, next) {

  var group = req.group;

  group.remove(function (err) {
    if (err) return next(err);

    res.send(200, 'Group removed');
  });
};

/**
 * Update Group
 */
exports.update = function (req, res, next) {

  var group = req.group;

  console.dir(req.body);

  group.set(req.body);

  group.save(function(err, group) {
    if (!err) {
      console.log('update successful');
      return res.send(group);
    } else {
      return next(err);
    }
  });

};

