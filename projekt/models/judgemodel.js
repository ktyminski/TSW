/**
 * Created by Karol on 28.05.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Judge = new Schema({
    code: {type: String, unique: true },
    name: String,
    surname: String

});

module.exports = mongoose.model('judge', Judge);
