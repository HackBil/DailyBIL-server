'use strict';

var async = require('async');
var mongoose = require('mongoose');

var Category = mongoose.model('Category');

module.exports.get = function(req, res, next) {
  async.waterfall([
    function getCategories(cb) {
      Category.find({}, cb);
    },
    function sendCatageories(categories, cb) {
      var stringedCategories = "";
      categories.forEach(function(category) {
        stringedCategories = stringedCategories + category.name + ",";
      });
      res.send(stringedCategories);
      cb();
    }
  ], function(err) {
    if(err) {
      console.log(err);
      throw err;
    }
    next();
  });
};