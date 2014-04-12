'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {
  async.waterfall([
    function checkMasterToken(cb) {
      console.log(process.env.MASTER_TOKEN);
      if(req.params.token.toString() !== process.env.MASTER_TOKEN.toString()) {
        return cb(new restify.InvalidArgumentError("Invalid token"));
      }
      cb();
    },
    function checkIntegrity(cb) {
      if(!req.params.user || !req.params.url || !req.params.title || !req.params.categories) {
        return cb(new restify.InvalidArgumentError("Missing argument: need a user, an url, a title and a least 1 category"));
      }
      cb();
    },
    function checkAndUpdateUser(cb) {
      var user = req.params.user;
      Category.update({name: user}, {name: user}, {upsert:true}, function(err) {
        console.log("Created user: ", user);
        cb(err);
      });
    },
    function checkAndUpdateCategories(cb) {
      async.each(req.params.categories, function(category, cb){
        Category.update({name: category}, {name: category}, {upsert:true}, function(err) {
          console.log("Created category: ", category);
          cb(err);
        });
      }, cb);
    },
    function storeTheTweet(cb) {
      var news = new News();
      news.url = req.params.url;
      news.title = req.params.title;
      news.categories = req.params.categories;
      news.save(function(err){
        console.log("New tweet created:", req.params.title, news.categories);
        cb(err);
      });
    },
    function sendInfo(cb) {
      res.send(202);
      cb();
    }
  ], next);
};