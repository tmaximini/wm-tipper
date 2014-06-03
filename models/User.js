var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Promise = require('bluebird');

var TipSchema = require('../models/TipSchema');
var Match = require('../models/Match');
var Group = require('../models/Group');

var _ = require('lodash');

var utils = require('../helpers/utils');

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

  createdAt: { type: Date, index: true },

  admin: { type: Boolean, default: false },
  // holds all the group IDs the user is in
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],

  tips: [TipSchema],

  profile: {
    name: { type: String, default: '', required: true, index: true },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  groupPoints: [ ],
  totalPoints: { type: Number, default: 0, index: true },

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
    options.perPage = options.perPage || 1000;
    options.page = options.page || 0;
    options.oderBy = options.orderBy || { 'name': 1 };

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      //.populate('locations', 'name adress fourSquareId')
      .sort(options.orderBy) // sort by name
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },


  updateCurrentPoints: function() {
    this.find({})  // { tips: { $not: { $size: 0 } }}
      .exec(function(err, users) {
        if (err) console.error(err);

        var promises = [];

        users.forEach(function(usr) {

          if (usr.groups.length > 0) {

            var _groupPoints = new Array(usr.groups.length);

            for (var i = 0; i < usr.groups.length; i++) {

              (function(usr, index) {
                promises.push(usr.getTotalPoints(usr.groups[index]).then(function(points) {

                  _groupPoints[index] = points;

                }));
              })(usr, i);
            }

            Promise.all(promises).then(function() {
              console.log('all promises resolved');
              var sum = 0;
              for (var j = _groupPoints.length; j--;) {
                sum += _groupPoints[j];
              }
              usr.groupPoints = _groupPoints;
              usr.totalPoints = sum;

              usr.save(function(err, user) {
                if (err) {
                  console.error(err);
                } else {
                  console.log('user has been updated', user.groupPoints);
                }
              });

            });

          }
      });
    });
  }

};


/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (user.isNew) {
    user.createdAt = Date.now();
  }


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


userSchema.methods.getTotalPoints = function (groupId) {
  var promises = [];
  var q = Promise.defer();

  if (!this.tips || this.tips.length === 0) {
    q.resolve(0);
  }
  else {
    this.tips.forEach(function(tip) {
      if (groupId) {
        if (tip.group.equals(groupId)) {
          promises.push(utils.getTipPointsPromise(tip));
        }
      }
      // else {
      //   promises.push(utils.getTipPointsPromise(tip));
      // }
    });
    Promise.all(promises).then(function(allPoints) {
      var total = 0;
      for (var i = allPoints.length; i--;) {
        total += allPoints[i]
      }
      q.resolve(total);
    });
  }
  return q.promise;
};


userSchema.methods.numberOfTipsInGroup = function (groupId) {
  var groupTips = this.tips.filter(function(tip) {
    return tip.group.equals(groupId);
  });
  return groupTips.length;
};


userSchema.methods.getTipsForMatch = function(matchId) {
  var self = this;
  var matchTips = this.tips.filter(function(tip) {
    return tip.match.equals(matchId);
  });

  var deferred = Promise.defer();
  var promises = [];

  // just need the plain js objects not the mongoose objects, so we'll use .toObject()
  var objArr = [];

  matchTips.forEach(function(tip) {

    var q = Promise.defer();

    Group.findOne({ '_id': tip.group }, function(err, group) {
      if (err) throw(err);
      if (group) {
        q.resolve(group);
      } else {
        q.reject();
      }
    });
    promises.push(q.promise);
  });

  Promise.all(promises).then(function(groups) {
    for (var i = 0; i < matchTips.length; i++) {
      objArr.push((matchTips[i]).toObject());
      objArr[i].groupSlug = groups[i].slug;
      objArr[i].groupName = groups[i].name;
    }
    deferred.resolve(objArr);
  });
  return deferred.promise;
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
