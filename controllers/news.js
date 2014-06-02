var mongoose = require('mongoose');
var News = require('../models/News');

var passportConf = require('../config/passport');

'use strict';

exports.load = function(req, res, next, id) {
  News.load(id, function (err, news) {
    if (err) return next(err);
    req.news = news;
    next();
  });
};

exports.index = function (req, res, next) {

  // pagination
  var totalCount = News.count();
  var perPage = 10;
  var page = req.query.page || 1;


  var condition = {
    published: true
  };
  // show also non published news to admins
  if (req.user && req.user.admin) {
    condition = {};
  }


  News.list({ criteria: condition }, function (err, _news) {
    if (err) return next(err);

    res.render('news/index.jade', {
      title: 'Alle News',
      news: _news
    });

  });
};


exports.new = function (req, res, next) {
  res.render('news/new.jade', {
    title: "Create News",
    news: new News({})
  });
  console.dir(res.locals);
}

exports.edit = function (req, res, next) {
  res.render('news/edit.jade', {
    title: "Edit News",
    news: req.news
  });
}


exports.create = function (req, res, next) {

  var newNews = new News(req.body);

  newNews.save(function(err, news) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Newseintrag wurde erstellt.' });
    return res.redirect('/news');
  });
}


/**
 *  Get news by id
 */
exports.show = function (req, res, next) {
  var news = req.news;
  if(!news) {
    req.flash('error', { msg: 'Dieser Newseintrag existiert nicht.' });
    res.redirect('/news');
  } else {

    res.render('news/show.jade', {
      title: news.title,
      news: news,
      user: req.user
    });

  }
};



/**
 * Update News
 */
exports.update = function (req, res, next) {

  var news = req.news;

  news.set(req.body);

  news.save(function(err, news) {
    if (!err) {
      console.log('update successful');
      req.flash('success', { msg: 'Newseintrag wurde aktualisiert' });
      return res.redirect('/news');
    } else {
      return next(err);
    }
  });

};


/**
 *  Delete News
 */
exports.delete = function (req, res, next) {
  var news = req.news;

  news.remove(function (err) {
    if (err) return next(err);
    req.flash('success', { msg: 'Die News wurde gelöscht' });
    res.redirect('/news');
  });
};