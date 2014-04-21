
/**
 * Load controllers.
 */

var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var groupController = require('../controllers/group');
var teamController = require('../controllers/team');
var topController = require('../controllers/top');
var matchController = require('../controllers/match');
var tipController = require('../controllers/tip');

/**
 * API keys + Passport configuration.
 */

var passport = require('passport');
var secrets = require('./secrets');
var passportConf = require('./passport');


module.exports = exports = function (app) {

  //// USER ////
  app.get('/', homeController.index);
  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset/:token', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);

  //// CONTACT ////
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);


  //// ACCOUNT ////
  app.get('/account', passportConf.isAuthenticated, userController.getAccount);
  app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
  app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
  app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


  //// GROUPS ////
  app.param('group', groupController.load);
  app.get('/groups', groupController.index);
  app.get('/groups/new', passportConf.isAuthenticated, groupController.new);
  app.post('/groups', passportConf.isAuthenticated, groupController.create);
  app.get('/groups/:group', passportConf.isAuthenticated, groupController.show);
  app.put('/groups/:group', passportConf.isAuthenticated, groupController.update);
  app.get('/groups/:group/edit', passportConf.isAuthenticated, groupController.edit);

  //// TEAMS ////
  app.param('team', teamController.load);
  app.get('/teams', teamController.index);
  app.get('/teams/new', passportConf.isAdmin, teamController.new);
  app.post('/teams', passportConf.isAdmin, teamController.create);
  app.get('/teams/:team', teamController.show);
  app.put('/teams/:team', passportConf.isAdmin, teamController.update);
  app.get('/teams/:team/edit', passportConf.isAdmin, teamController.edit);

  //// MATCHES ////
  app.param('match', matchController.load);
  app.get('/matches', matchController.index);
  app.get('/matches/new', passportConf.isAdmin, matchController.new);
  app.post('/matches', passportConf.isAdmin, matchController.create);
  app.get('/matches/:match', matchController.show);
  app.put('/matches/:match', passportConf.isAdmin, matchController.update);
  app.get('/matches/:match/edit', passportConf.isAdmin, matchController.edit);

  ///// TIPS ////
  app.get('/matches/:match/tip', passportConf.isAuthenticated, tipController.newMatchTip);
  app.post('/tips', passportConf.isAuthenticated, tipController.create);


  /// SPIELPLAN ////
  app.get('/plan', matchController.index); // use match index for now until we have a better layouted version

  /// BESTENLISTE ////
  app.get('/bestenliste', topController.index);




  /**
   * OAuth routes for sign-in.
   */

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

};

