/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Das WM Tippspiel zur Fussball WM 2014 für Büro, Freunde und Familie'
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