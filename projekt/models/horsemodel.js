/**
 * Created by Karol on 28.05.2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Horse = new Schema({
    name: {type: String, unique: true},
    sex: String,
    owner: String
});

module.exports = mongoose.model('horse', Horse);
