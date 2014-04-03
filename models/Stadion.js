var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stadionSchema = new Schema({
  name: { type: String, unique: true },
  image: String,
  ll: String, // latitude  longitude
  max_visitors: Number
});


module.exports = mongoose.model('Stadion', stadionSchema);
