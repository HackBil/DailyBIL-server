'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var User = mongoose.model('User');
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
      if(!req.params.url || !req.params.title) {
        return cb(new restify.InvalidArgumentError("Missing argument: an url and a title"));
      }
      cb();
    },
    function checkAndUpdateUser(cb) {
      var user = req.params.user || "";
      User.update({name: user}, {name: user}, {upsert:true}, function(err) {
        cb(err);
      });
    },
    function checkAndUpdateCategories(cb) {
      if(req.params.categories) {
        var categories = req.params.categories.toString().split(',');
        async.each(categories, function(category, cb){
          Category.update({name: category}, {name: category}, {upsert:true}, function(err) {
            console.log("Created category: ", category);
            cb(err);
          });
        });
      }
      cb();
    },
    function storeTheTweet(cb) {
      var news = new News();
      news.url = req.params.url;
      news.title = req.params.title;
      news.categories = req.params.categories;
      news.user = req.params.user;
      news.save(function(err) {
        console.log("New tweet created by", req.params.user || "", ":", req.params.title, news.categories || "");
        cb(err);
      });
    },
    function sendInfo(cb) {
      setTimeout(function() {
        res.send(202);
      }, 1000);
      cb();
    }
  ], function(err) {
    if(err){
      console.log(err);
    }
    next(err);
  });
};


module.exports.get = function(req, res, next) {
  async.waterfall([
    function getUsers(cb) {
      News.find({}, {__v: false, _id: false}, cb);
    },
    function sendCatageories(news, cb) {
      res.send(news);
      console.log("Getting news");
      cb();
    }
  ], next);
};
