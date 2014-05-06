var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var utils = require('../helpers/utils');

var groupSchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  founder: { type: Schema.Types.ObjectId, ref: 'User' },
  price: String,
  rules: String,
  is_public: Boolean,
  password: String
});


/**
 * Hash the password for security.
 */

groupSchema.pre('save', function(next) {
  var group = this;

  if (!group.isModified('password')) return next();

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

/**
 * Pre-save hook
 */
 groupSchema
  .pre('save', function(next) {
    if (!this.slug) {
      this.slug = utils.convertToSlug(this.name);
    }
    next();
  });



module.exports = mongoose.model('Group', groupSchema);
