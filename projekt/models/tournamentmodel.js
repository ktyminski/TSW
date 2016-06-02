/**
 * Created by Karol on 01.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tournament = new Schema({
    name: String,
    city: String,
    number: {type: String, unique: true},
    groups: []
});

module.exports = mongoose.model('tournament', Tournament);