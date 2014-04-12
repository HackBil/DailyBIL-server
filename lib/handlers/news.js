'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {
  var name;
  async.waterfall([
    function checkMasterToken(cb) {
      if(req.params.token !== process.env.MASTER_TOKEN) {
        return cb(new restify.InvalidArgumentError("Missing token"));
      }
      cb();
    },
    function checkIntegrity(cb) {
      if(!req.params.user || !req.params.url || !req.params.title || !req.params.categories) {
        return cb(new restify.InvalidArgumentError("Missing argument: need a user, an url, a title and a least 1 category"));
      }
      User.findOne({token: req.params.token}, function(err, user) {
        if(!user) {
          return cb(new restify.InvalidArgumentError("Invalid token"));
        }
        name = user.name;
        cb();
      });
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