var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  when: Date,
  team1: { type: Schema.Types.ObjectId, ref: 'Team' },
  team2: { type: Schema.Types.ObjectId, ref: 'Team' },
  stadion: { type: Schema.Types.ObjectId, ref: 'Stadion' },
  result: { type: String }, // really String? default?

});


module.exports = mongoose.model('Match', matchSchema);
