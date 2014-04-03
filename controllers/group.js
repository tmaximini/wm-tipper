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

  // generate slug from title
  // newStory.slug = utils.convertToSlug(newStory.title);

  newGroup.save(function(err, group) {
    if (err) {
      return next(err);
    }
    return res.json(group);
  });
}


/**
 *  Get group by id
 */
exports.show = function (req, res, next) {
  var group = req.group;

  if(!group) {
    res.send(404, 'STORY_NOT_FOUND');
  } else {
    res.send(group);
  }

};

/**
 *  Delete group
 */
exports.delete = function (req, res, next) {

  var group = req.group;

  group.remove(function (err) {
    if (err) return next(err);

    res.send(200, 'Story removed');
  });
};

/**
 * Update Story
 */
exports.update = function (req, res, next) {

  var group = req.group;

  console.dir(req.body);

  group.set(req.body);
  group.slug = utils.convertToSlug(req.body.title);

  group.save(function(err, group) {
    if (!err) {
      console.log('update successful');
      return res.send(group);
    } else {
      return next(err);
    }
  });

};


/*

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Group.count();
  var perPage = 10;
  var page = req.query.page || 1;


  Group.find().sort('created').skip((page -1) * perPage).limit(perPage).exec(function (err, groups) {
    if (err) return next(err);
    res.status(200).render('groups/index.jade', {
      title: "Nock Groups",
      groups: groups,
      totalCount: totalCount,
      page: page,
      perPage: perPage
    });
  });
}


exports.show = function (req, res, next) {

  var group = req.group;

  if (!group) return next(); // 404

  res.render('groups/show.jade', {
    title: group.title,
    group: group
  });
}


exports.edit =  function (req, res) {
  res.render('groups/edit.jade', {
    group: req.group,
    errors: [],
    title: "Edit Group"
  });
}


exports.update = function (req, res, next) {

  var group = req.group;

  group.set(req.body);
  group.slug = utils.convertToSlug(req.body.title);

  group.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      console.log('update successful');
      return res.redirect('/groups/' + group.slug);
    } else {
      console.error('update error', err);
      return res.render('groups/edit', {
        title: 'Edit Group',
        group: group,
        errors: err.errors
      });
    }
  });

}


exports.destroy = function (req, res, next) {

  var group = req.group;

  // validate logged in user authored this group
  if (!req.session.user) {
    return res.status(403).render('404', { title: "Forbidden.", errorMessage: "You don't have the permission to do that." } );
  }

  group.remove(function (err) {
    if (err) return next(err);

    // TODO display a confirmation msg to user
    res.redirect('/groups');
  });
}

*/
