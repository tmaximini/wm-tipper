var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../helpers/utils');

var newsSchema = new Schema({
  title: { type: String, unique: true, required: true },
  slug: { type: String, unique: true },
  body: { type: String, required: true },
  createdAt: { type: Date, index: true },
  published: { type: Boolean, default: false }
});


/**
 * Static Methods
 */
 newsSchema.statics = {

  load: function (id, cb) {
    var query = {$or: [{slug: id}]};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({_id: id});
    }
    this.findOne(query)
      .exec(cb)
  },

  list: function (o, cb) {
    var options = o || {};
    var sortOrder = options.orderBy || { 'createdAt': -1 };
    var criteria = options.criteria || {};
    options.perPage = options.perPage || 200;
    options.page = options.page || 0;

    this.find(criteria)
      .sort(sortOrder)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};


/**
 * Pre-save hook
 */
 newsSchema
  .pre('save', function(next) {
    if (!this.slug) {
      this.slug = utils.convertToSlug(this.title);
    }
    if (this.isNew) {
      this.createdAt = Date.now();
    }
    next();
  });


module.exports = mongoose.model('News', newsSchema);
