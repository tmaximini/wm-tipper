var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var utils = require('../helpers/utils');

var groupSchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true, index: true },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  founder: { type: Schema.Types.ObjectId, ref: 'User' },
  price: String,
  rules: String,
  freetext: String,
  is_public: { type: Boolean, default: false },
  password: String,
  password_freetext: String
});


/**
 * Hash the password for security.
 */

groupSchema.pre('save', function(next) {
  var group = this;

  // generate slug
  if (!this.slug) {
    this.slug = utils.convertToSlug(this.name);
  }
  // if nothing changed on pw, leave as is
  if (!this.isModified('password')) return next();

  // if no password, make public
  if (!this.password || this.password === '') {
    this.is_public = true;
    next();
  }
  // if password, make private
  this.is_public = false;
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(group.password, salt, null, function(err, hash) {
      if (err) return next(err);
      group.password = hash;
      next();
    });
  });
});


/**
 * Check if candidate entered the correct password to join the group
 */

groupSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


/**
 * Static Methods
 */
groupSchema.statics = {

  load: function (id, cb) {
    var query = { $or: [{ slug: id }] };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: id });
    }
    this.findOne(query)
    .populate('founder')
    .populate('members')
    .exec(cb)
      //.populate('author', 'username email')
  },

  list: function (o, cb) {
    var options = o || {};
    var criteria = options.criteria || {}
    options.perPage = options.perPage || 200;
    options.page = options.page || 0;

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      //.populate('locations', 'name adress fourSquareId')
      .sort({ 'name': 1 }) // sort by name
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};




module.exports = mongoose.model('Group', groupSchema);
