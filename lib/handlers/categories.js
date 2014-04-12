'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Category = mongoose.model('Category');

module.exports.get = function(req, res, next) {
  async.waterfall([
    function getCategories(cb) {
      Category.find({}, cb);
    },
    function sendCatageories(categories, cb) {
      categories = categories.map(function(category) {
        return category.name;
      });
      res.send(categories);
      cb();
    }
  ], next);
};