/**
 * Created by Karol on 28.05.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
    _id: {type: String, unique: true},

});

module.exports = mongoose.model('admin', Admin);
