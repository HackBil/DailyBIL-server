'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {
  if(!req.params.token || !req.params.categories) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define a token and at least 1 category"));
  }
  async.parallel([
    function addCategories(cb){
      var categories = req.params.categories.toString().split(',');
      async.each(categories, function(category, cb){
        Category.update({name: category}, {name: category}, {upsert:true}, cb);
      }, cb);
    },
    async.waterfall([
      function createTwitter(cb) {
        var tweeter = new Tweeter();
        tweeter.twitterToken = req.params.token;
        tweeter.categories = req.params.categories.toString().split(',');
        tweeter.save(cb);
      },
      function sendResponse(tweeter, count, cb) {
        console.log("New tweeter:", tweeter.twitterToken, tweeter.categories);
        res.send();
        cb();
      }
    ], next)
  ]);
};

module.exports.get = function(req, res, next) {
  if(!req.params || !req.params.token) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define a token"));
  }
  async.waterfall([
    function getCategories(cb) {
      Tweeter.find({twitterToken: req.params.token}, {"__v": false, "_id": false, "twitterToken": false}, cb);
    },
    function formatizeCategories(tweeters, cb) {
      var formatedTweeters = [];
      tweeters.forEach(function(tweeter){
        formatedTweeters.push(tweeter.categories);
      });
      cb(null, formatedTweeters);
    },
    function sendResponse(tweeters, cb){
      res.send(tweeters);
      cb();
    }
  ], function(err) {
    if(err){
      throw err;
    }
    next();
  });
};