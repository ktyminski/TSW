
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rating = new Schema({
    tournament: String,
    group: String,
    horse: String,
    judge: String,
    type: String,
    head: String,
    clog: String,
    legs: String,
    movement: String
    
});

module.exports = mongoose.model('rating', Rating);