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
      title: 'Alle Partien',
      tips: _tips
    });

  });
}


exports.new = function (req, res, next) {

  Team.list({}, function (err, _teams) {

    if (err) return next(err);

    res.render('tip/new.jade', {
      title: "Neue Partie erstellen",
      tip: new Tip({}),
      teams: _teams
    });

  });

}

exports.edit = function (req, res, next) {
  Team.list({}, function (err, _teams) {
    if (err) return next(err);

    res.render('tip/edit.jade', {
      title: "Partie bearbeiten",
      tip: req.tip,
      teams: _teams
    });

  });
}


exports.create = function (req, res, next) {

  console.log('creating new tip:');
  console.dir(req.body);

  var tip = new Tip(req.body);
  tip.founder = req.user;

  var newTip = new Tip(req.body);

  newTip.save(function(err, tip) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Partie wurde erstellt.' });
    return res.redirect('/tips');
  });
}


/**
 *  Get tip by id
 */
exports.show = function (req, res, next) {
  var tip = req.tip;

  // TODO: render correctly

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

  console.dir(req.body);

  tip.set(req.body);

  tip.save(function(err, tip) {
    if (!err) {
      console.log('update successful');
      return res.send(tip);
    } else {
      return next(err);
    }
  });

};

