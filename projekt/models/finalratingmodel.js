var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinalRating = new Schema({
    id: {type: String, unique: true},
    tournament: String,
    group: String,
    horse: String,
    type: String,
    head: String,
    clog: String,
    legs: String,
    movement: String,
    all: String

});

module.exports = mongoose.model('finalrating', FinalRating);
