var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipSchema = require('../models/TipSchema');

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  linkedin: String,
  tokens: Array,

  createdAt: { type: Date },

  admin: { type: Boolean, default: false },
  // holds all the group IDs the user is in
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],

  tips: [TipSchema],

  profile: {
    name: { type: String, default: '', required: true },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});







/**
 * Static Methods
 */
 userSchema.statics = {

  list: function (o, cb) {
    var options = o || {};
    var criteria = options.criteria || {}
    options.perPage = options.perPage || 50;
    options.page = options.page || 0;
    options.oderBy = options.orderBy || { 'name': 1 };

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      //.populate('locations', 'name adress fourSquareId')
      .sort(options.orderBy) // sort by name
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};


/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  user.createdAt = Date.now();

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


/**
 * Add a group to the user's profile
 * (max 3 groups, no dupes)
 */

userSchema.methods.addGroup = function(group, cb) {
  this.groups.push(group);
  this.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};


userSchema.methods.totalPointsPerGroup = function (groupId) {
  var total = 0;
  this.tips.forEach(function(tip) {
    if (tip.group.equals(groupId)) {
      total += tip.points;
    }
  });
  return total;
};


userSchema.methods.totalPointsAllGroups = function () {
  var total = 0;
  this.tips.forEach(function(tip) {
    total += tip.points;
  });
  return total;
};


userSchema.methods.numberOfTipsInGroup = function (groupId) {
  var groupTips = this.tips.filter(function(tip) {
    return tip.group.equals(groupId);
  });
  return groupTips.length;
};

/**
 * Load tip by id
 */
userSchema.methods.loadTip = function (id, cb) {
  var tip = this.tips.id(id).populate('match group');
  if (tip) {
    cb(null, tip);
  } else {
    cb(new Error('tip not found'), null);
  }
};


/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = 'retro';

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
  }

  var md5 = crypto.createHash('md5').update(this.email);
  return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', userSchema);
