/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.privacy = function(req, res) {
  res.render('static/privacy', {
    title: 'Nutzungsbedingungen'
  });
};

exports.impressum = function(req, res) {
  res.render('static/impressum', {
    title: 'Impressum'
  });
};