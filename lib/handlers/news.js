'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {
  if(req.params.token.toString() !== process.env.MASTER_TOKEN.toString()) {
    return next(new restify.InvalidArgumentError("Invalid token"));
  }
  if(!req.params.url || !req.params.title) {
    return next(new restify.InvalidArgumentError("Missing argument: an url and a title"));
  }
  async.waterfall([
    function checkAndUpdateUser(cb) {
      var user = req.params.user || "";
      User.update({name: user}, {name: user}, {upsert:true}, function(err) {
        cb(err);
      });
    },
    function checkAndUpdateCategories(cb) {
      var categories;
      if(req.params.categories) {
        categories = req.params.categories.toString().split(',');
        async.each(categories, function(category, cb){
          Category.update({name: category}, {name: category}, {upsert:true}, cb);
        });
      }
      cb(null, categories);
    },
    function storeTheTweet(categories, cb) {
      var news = new News();
      news.url = req.params.url;
      news.title = req.params.title;
      news.categories = categories;
      news.user = req.params.user;
      news.save(function(err) {
        console.log("New news created by", req.params.user || "", ":", req.params.title, categories || "");
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
      cb();
    }
  ], next);
};
