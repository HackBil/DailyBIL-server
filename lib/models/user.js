'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  token: String,
});

module.exports = mongoose.model('User', UserSchema);
