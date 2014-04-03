var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var groupSchema = new Schema({
  name: { type: String, unique: true },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
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
    this.findOne({ _id : id })
      .populate('author', 'username email')
      .exec(cb)
  }

};


module.exports = mongoose.model('Group', groupSchema);
