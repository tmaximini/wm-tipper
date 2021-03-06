var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Match = require('../models/Match');

var tipSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  scoreTeam1: { type: Number, required: true },
  scoreTeam2: { type: Number, required: true },
  matchId: String,
  bet: { type: String, required: true, default: 'X', index: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true, index: true }
});


tipSchema.virtual('result').get(function () {
  return this.scoreTeam1 + ' - ' + this.scoreTeam2;
});


tipSchema.virtual('points').get(function() {

  var points = 0;
  var st1 = this.match.scoreTeam1;
  var st2 = this.match.scoreTeam2;

  if ((st1 === this.scoreTeam1) && (st2 === this.scoreTeam2)) {
    points = 3;
  } else {

      if ((this.bet === 'X' && (st1 === st2)) ||
          (this.bet === '1' && (st1 > st2)) ||
          (this.bet === '2' && (st1 < st2))) {
        points = 1;
      }
  }
  return points;
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
      .populate('user match group')

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
      .populate('match')
      .sort(options.order)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};



module.exports = tipSchema;
