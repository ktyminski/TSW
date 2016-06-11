/**
 * Created by Karol on 03.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aTournament = new Schema({
    name: {type: String, unique: true},
    city: String,
    groups: [],
    actualgroup: [],
    actualhorse: [],
    judges: [],
    
    
});

module.exports = mongoose.model('atournament', aTournament);