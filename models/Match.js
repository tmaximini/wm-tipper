var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  when: Date,
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreTeam1: { type: Number },
  scoreTeam2: { type: Number },
  result: { type: String } // really String? default?
});

/**
 * Static Methods
 */
matchSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('team1', 'name slug')
      .populate('team2', 'name slug')
      .exec(cb)
  },

  list: function (o, cb) {
    var options = o || {};
    var criteria = options.criteria || {}
    options.perPage = options.perPage || 200;
    options.page = options.page || 0;
    options.order = options.order || { 'name': 1 };

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      .populate('team1', 'name slug')
      .populate('team2', 'name slug')
      .sort(options.order)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};


/**
 * Pre-save hook
 */
 matchSchema
  .pre('save', function(next) {
    this.when = new Date(this.startDate + ' ' + this.startTime);
    next();
  });

module.exports = mongoose.model('Match', matchSchema);
