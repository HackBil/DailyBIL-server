'use strict';
var mongoose = require('mongoose');

var TweeterSchema = new mongoose.Schema({
  twitterToken: String,
  categories: [String],
});

module.exports = mongoose.model('Tweeter', TweeterSchema);
