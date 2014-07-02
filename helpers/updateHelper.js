var mongoose = require('mongoose');
var secrets = require('../config/secrets');

var User  = require('../models/User');
var Team  = require('../models/Team');
var Match = require('../models/Match');

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});


User.updateCurrentPoints();