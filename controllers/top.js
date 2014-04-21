/**
 * GET /top
 * Top 10 page.
 */

exports.index = function(req, res) {
  res.render('top/index', {
    title: 'Bestenliste'
  });
};
