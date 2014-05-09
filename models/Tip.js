var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  scoreTeam1: { type: Number, required: true },
  scoreTeam2: { type: Number, required: true },
  bet: { type: String, required: true, default: 'X', index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true, index: true }
});



/**
 * compute 'bet' before save
 * '1': team 1 wins
 * '2': Team 2 wins
 * 'X': draw
 *
 *  also add user's group as group to tip for better indexing later
 *
 */
tipSchema.pre('save', function(next) {
  if (this.scoreTeam1 > this.scoreTeam2) {
    this.bet = '1';
  }
  if (this.scoreTeam1 < this.scoreTeam2) {
    this.bet = '2';
  }
  next();
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
  getUserTipsForGroup: function (user, group, cb) {
    this.find({ user : user, group: group })
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
