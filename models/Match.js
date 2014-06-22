var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Promise = require('bluebird');

var moment = require('moment-timezone');
moment.lang('de');

var matchSchema = new Schema({
  when: Date,
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreTeam1: { type: Number, required: true, default: 0 },
  scoreTeam2: { type: Number, required: true, default: 0 },
  isDummy: { type: Boolean, default: false },
  matchType: String
});


/**
 * Virtuals
 */
var minute = 1000 * 60;

matchSchema.virtual('result').get(function () {
  return this.scoreTeam1 + ' : ' + this.scoreTeam2;
});
matchSchema.virtual('started').get(function () {
  return this.when <= Date.now();
});
matchSchema.virtual('over').get(function () {
  var endTime = this.when.getTime() + (110*minute);
  return endTime <= Date.now();
});
matchSchema.virtual('running').get(function () {
  var endTime = this.when.getTime() + (110*minute);
  return ((this.when <= Date.now()) && (Date.now() <= endTime));
});
matchSchema.virtual('formattedDate').get(function () {
  return moment(this.startDate).format('DD.MM.YYYY') + ' - ' + this.startTime;
});
matchSchema.virtual('status').get(function () {

  var matchEnds = this.when.getTime() + (minute * 109);
  if (this.when > Date.now()) {
    return 'Noch nicht begonnen';
  } else {
    console.log(matchEnds, Date.now());
    if (matchEnds < Date.now()) {
      return 'Match beendet';
    } else {

      var diff = Date.now() - this.when.getTime();
      var min = Math.floor((diff/1000)/60);

      if (min < 46) {
        return 'Match läuft - 1. HZ - ' + min + '. min';
      }
      if (min > 61) {
        return 'Match läuft - 2. HZ - ' + (min - 15) + '. min';
      }
      return 'Match läuft - Halbzeitpause';
    }
  }
});
matchSchema.virtual('i18nDateString').get(function () {
  return moment(this.when).tz('Europe/Berlin').calendar();
});
matchSchema.virtual('i18nDateFromNow').get(function () {
  return moment(this.when).tz('Europe/Berlin').fromNow();
});

/**
 * Static Methods
 */
matchSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('team1', 'name slug gruppe isDummy')
      .populate('team2', 'name slug gruppe isDummy')
      .exec(cb)
  },


  list: function (o, cb) {
    var options = o || {};
    var criteria = options.criteria || {}
    options.perPage = options.perPage || options.limit || 100;
    options.page = options.page || 0;
    options.order = options.orderBy || { 'when': 1 };

    this.find(criteria)
      //.select('_id slug title body created points image meta attempts locations')
      .populate('team1', 'name slug gruppe isDummy')
      .populate('team2', 'name slug gruppe isDummy')
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
