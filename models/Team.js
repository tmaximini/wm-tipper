var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  name: { type: String, unique: true },
  image: String
});


module.exports = mongoose.model('Team', teamSchema);
