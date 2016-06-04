/**
 * Created by Karol on 01.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tournament = new Schema({
    name: {type: String, unique: true},
    city: String,
    groups: []
});

module.exports = mongoose.model('tournament', Tournament);