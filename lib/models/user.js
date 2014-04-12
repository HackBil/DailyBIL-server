'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {type: String, index: {unique: true, dropDups: true}},
});

module.exports = mongoose.model('User', UserSchema);
