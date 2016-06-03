/**
 * Created by Karol on 03.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aTournament = new Schema({
    name: String,
    city: String,
    number: {type: String, unique: true},
    groups: [],
    actualgroup: Number,
    actualhorse: Number
});

module.exports = mongoose.model('atournament', aTournament);