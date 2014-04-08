var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../helpers/utils');

var teamSchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true },
  image: String
});


/**
 * Static Methods
 */
 teamSchema.statics = {

  load: function (id, cb) {
    this.findOne( { slug : id } )
      //.populate('author', 'username email')
      .exec(cb)
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
 teamSchema
  .pre('save', function(next) {
    if (!this.slug) {
      this.slug = utils.convertToSlug(this.name);
    }
    next();
  });


module.exports = mongoose.model('Team', teamSchema);
