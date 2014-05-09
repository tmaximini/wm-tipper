var mongoose = require('mongoose');
var Match = require('../models/Match');
var Tip = require('../models/Tip');

var passportConf = require('../config/passport');

'use strict';

exports.load = function(req, res, next, id) {
  Tip.load(id, function (err, tip) {
    if (err) return next(err);
    if (!tip) return next(new Error('not found'));
    req.tip = tip;
    next();
  });
}

exports.index = function (req, res, next) {

  // pagination
  var totalCount = Tip.count();
  var perPage = 20;
  var page = req.query.page || 1;

  var options = {
    criteria: {

    },
    order: {
      'createdAt': '1'
    }
  };

  Tip.list(options, function (err, _tips) {
    if (err) return next(err);

    res.render('tip/index.jade', {
      title: 'Alle Tips',
      tips: _tips
    });

  });
}


exports.newMatchTip = function (req, res, next) {

  res.render('tip/new.jade', {
    title: "Neuen Tip erstellen",
    tip: new Tip({}),
    match: req.match,
    group: req.group,
    action: '/groups/'+req.group.slug+'/matches/'+req.match.id+'/tips'
  });

}

exports.edit = function (req, res, next) {

  console.dir(req.tip);

  res.render('tip/edit.jade', {
    title: "Tip editieren",
    tip: req.tip,
    match: req.match,
    group: req.group,
    action: '/groups/'+req.group.slug+'/matches/'+req.match._id+'/tips/'+req.tip._id
  });

}


exports.create = function (req, res, next) {

  console.log('creating new tip:');
  console.dir(req.body);

  var newTip = new Tip(req.body);

  newTip.user = req.user;
  newTip.group = req.group;

  newTip.save(function(err, tip) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Dein Tip wurde gespeichert.' });
    return res.redirect('groups/' + req.group.slug + '/spielplan');
  });
}


/**
 *  Get tip by id
 */
exports.show = function (req, res, next) {
  var tip = req.tip;


  if(!tip) {
    req.flash('error', { msg: 'Dieser Tip existiert nicht.' });
    res.redirect('/tips');
  } else {
    res.render('tip/show.jade', {
      title: 'Tip Details',
      tip: req.tip
    });
  }

};

/**
 *  Delete Tip
 */
exports.delete = function (req, res, next) {

  var tip = req.tip;

  tip.remove(function (err) {
    if (err) return next(err);

    res.send(200, 'Tip removed');
  });
};

/**
 * Update Tip
 */
exports.update = function (req, res, next) {

  var tip = req.tip;
  var group = req.group;

  console.dir(req.body);

  tip.set(req.body);

  tip.save(function(err, tip) {
    if (!err) {
      req.flash('success', { msg: 'Dein Tip wurde aktualisiert.' });
      return res.redirect('/groups/'+group.slug+'/spielplan')
    } else {
      return next(err);
    }
  });

};

