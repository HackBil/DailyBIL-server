'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var NewsSchema = new mongoose.Schema({
  url: String,
  title: String,
  categories: [String],
  user: String,
  usedBy: [ObjectId]
});

module.exports = mongoose.model('News', NewsSchema);
