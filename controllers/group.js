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
  res.render('group/index.jade', {
    title: "Alle Gruppen"
  });
}


exports.new = function (req, res, next) {
  res.render('group/new.jade', {
    title: "Create Group",
    group: new Group({}),
    errors: []
  });
  console.dir(res.locals);
}

/*
exports.create = function (req, res, next) {
  var group = new Group(req.body);
  group.author = req.user;

  var groupId = utils.convertToSlug(req.body.title);

  Group.findOne({ 'slug': groupId }, function (err, doc) {
    if (err) return next(err);
    if (doc) {
      console.log("group already exists!");

      return res.status(400).render('groups/new', {
        title: 'New Group',
        group: group,
        errors: ["Group with that name already exists"]
      });

    }
    else {
      group.slug = groupId;
      group.uploadAndSave(req.files.image, function (err) {
        if (!err) {
          req.flash('success', 'Successfully created group!');
          console.log('Successfully created group!');
          return res.redirect('/groups/' + group.slug);
        } else {
          // error occured
          res.redirect('groups/new', {
            title: "New Group",
            group: group,
            errors: utils.errors(err.errors || err)
          });
        }
      });
    }
  })
}


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
