/**
 * Created by Karol on 28.05.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Judge = new Schema({
    name: String,
    surname: String,
    code: {type: String, unique: true }
});

module.exports = mongoose.model('judge', Judge);
