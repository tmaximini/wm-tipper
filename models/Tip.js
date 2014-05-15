var mongoose = require('mongoose');
var tipSchema = require('./TipSchema');


module.exports = mongoose.model('Tip', tipSchema);
