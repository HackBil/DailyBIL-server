'use strict';
var mongoose = require('mongoose');

var TweeterSchema = new mongoose.Schema({
  accessToken: String,
  accessTokenSecret: String,
  categories: [String],
});

module.exports = mongoose.model('Tweeter', TweeterSchema);
