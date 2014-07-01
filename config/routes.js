
/**
 * Load controllers.
 */

var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var groupController = require('../controllers/group');
var teamController = require('../controllers/team');
var newsController = require('../controllers/news');
var topController = require('../controllers/top');
var matchController = require('../controllers/match');
var tipController = require('../controllers/tip');
var adminController = require('../controllers/admin');

/**
 * API keys + Passport configuration.
 */

var passport = require('passport');
var secrets = require('./secrets');
var passportConf = require('./passport');

var moment = require('moment');
moment.lang('de');

module.exports = exports = function (app) {


  // make moment.js available in all .jade views
  app.locals.moment = moment;
  app.locals.utils = require('../helpers/utils');

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


  ///// STATIC /////
  app.get('/privacy', homeController.privacy);
  app.get('/impressum', homeController.impressum);
  app.get('/regeln', homeController.rules);

  //// ADMIN ////
  app.get('/admin', passportConf.isAdmin, adminController.index);

  //// CONTACT ////
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);


  //// ACCOUNT ////
  app.get('/account', passportConf.isAuthenticated, userController.getAccount);
  app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
  app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
  app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

  app.get('/users', passportConf.isAdmin, userController.getUserList);


  //// GROUPS ////
  app.param('group', groupController.load);
  app.get('/groups', groupController.index);
  app.get('/erste-schritte', groupController.joinOrCreate);
  app.get('/groups/new', passportConf.isAuthenticated, groupController.new);
  app.post('/groups', passportConf.isAuthenticated, groupController.create);
  app.get('/groups.json', groupController.indexJson);
  app.get('/groups/:group', passportConf.isAuthenticated, groupController.show);
  app.get('/groups/:group/join', passportConf.isAuthenticated, groupController.join);
  app.get('/groups/:group/leave', passportConf.isAuthenticated, groupController.leave);
  app.post('/groups/:group/join', passportConf.isAuthenticated, groupController.joinConfirm);
  app.put('/groups/:group', passportConf.isAuthenticated, groupController.update);
  app.del('/groups/:group', passportConf.isGroupOwner, groupController.delete);
  app.get('/groups/:group/edit', passportConf.isAuthenticated, groupController.edit);
  app.post('/groups/:group/invite', passportConf.isAuthenticated, groupController.sendInvite);
  app.post('/groups/:group/addComment', passportConf.isAuthenticated, groupController.addComment);

  //// TEAMS ////
  app.param('team', teamController.load);
  app.get('/teams', teamController.index);
  app.get('/teams/new', passportConf.isAdmin, teamController.new);
  app.post('/teams', passportConf.isAdmin, teamController.create);
  app.get('/teams/:team', teamController.show);
  app.put('/teams/:team', passportConf.isAdmin, teamController.update);
  app.del('/teams/:team', passportConf.isAdmin, teamController.delete);
  app.get('/teams/:team/edit', passportConf.isAdmin, teamController.edit);


  //// NEWS ////
  app.param('news', newsController.load);
  app.get('/news', newsController.index);
  app.get('/news/new', passportConf.isAdmin, newsController.new);
  app.post('/news', passportConf.isAdmin, newsController.create);
  app.get('/news/:news', newsController.show);
  app.put('/news/:news', passportConf.isAdmin, newsController.update);
  app.del('/news/:news', passportConf.isAdmin, newsController.delete);
  app.get('/news/:news/edit', passportConf.isAdmin, newsController.edit);

  //// MATCHES ////
  app.param('match', matchController.load);
  app.get('/matches', matchController.index);
  app.get('/matches/new', passportConf.isAdmin, matchController.new);
  app.post('/matches', passportConf.isAdmin, matchController.create);
  app.get('/matches/:match', matchController.show);
  app.get('/groups/:group/matches/:match', passportConf.isAuthenticated, matchController.showGroupTip);
  app.put('/matches/:match', passportConf.isAdmin, matchController.update);
  app.get('/matches/:match/edit', passportConf.isAdmin, matchController.edit);
  app.del('/matches/:match', passportConf.isAdmin, matchController.delete);

  // group matches
  // app.get('/groups/:group/matches', matchController.groupIndex);
  app.get('/groups/:group/spielplan', matchController.groupIndex);

  ///// TIPS ////
  app.param('tip', tipController.load);
  // tips only per group
  app.get('/groups/:group/matches/:match/tips/new', passportConf.isAuthenticated, tipController.newMatchTip);
  app.get('/groups/:group/matches/:match/tips/:tip/edit', passportConf.isAuthenticated, tipController.edit);
  app.put('/groups/:group/matches/:match/tips/:tip', passportConf.isAuthenticated, tipController.update);
  app.get('/groups/:group/matches/:match/tips/:tip', passportConf.isAuthenticated, tipController.showGroupTip);
  app.post('/groups/:group/matches/:match/tips', passportConf.isAuthenticated, tipController.create);


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

