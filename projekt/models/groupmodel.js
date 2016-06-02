/**
 * Created by Karol on 02.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
    name: {type: String, unique: true},
    type: String,
    horses: [],
    judges: []
});

module.exports = mongoose.model('group', Group);