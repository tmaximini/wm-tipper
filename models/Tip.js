var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  scoreTeam1: { type: String, required: true },
  scoreTeam2: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  private: { type: Boolean, default: false }
});

/**
 * Static Methods
 */
tipSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user')
      .populate('match')
      .exec(cb);
  },


  // retrieves all Tips from a current user
  getUserTips: function (user, cb) {
    this.find({ user : user })
      .populate('match')
      .exec(cb);
  },

  list: function (o, cb) {
    var options = o || {};
    var criteria = options.criteria || {}
    options.perPage = options.perPage || 200;
    options.page = options.page || 0;
    options.order = options.order || { 'name': 1 };

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      .populate('user')
      .sort(options.order)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};



module.exports = mongoose.model('Tip', tipSchema);
