/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Das Tippspiel zur Fussball Weltmeisterschaft 2014 in Brasilien'
  });
};

exports.privacy = function(req, res) {
  res.render('static/privacy', {
    title: 'Datenschutz'
  });
};

exports.impressum = function(req, res) {
  res.render('static/impressum', {
    title: 'Impressum'
  });
};