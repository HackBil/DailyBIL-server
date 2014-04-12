'use strict';
var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  url: String,
  title: String,
  categories: [String],
  user: String,
});

module.exports = mongoose.model('News', NewsSchema);
