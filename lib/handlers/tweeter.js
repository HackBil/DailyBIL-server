'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {
  if(!req.params || !req.params.access_token || !req.params.access_token_secret || !req.params.categories) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define an access_token, an access_token_secret and at least 1 category"));
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
        tweeter.accessToken = req.params.access_token;
        tweeter.accessTokenSecret = req.params.access_token_secret;
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
  if(!req.params || !req.params.access_token || !req.params.access_token_secret) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define an access_token and an access_token_secret"));
  }
  async.waterfall([
    function getCategories(cb) {
      Tweeter.find({accessToken: req.params.access_token, accessTokenSecret: req.params.access_token_secret}, {"__v": false, "_id": false, "accessToken": false, "accessTokenSecret": false}, cb);
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

module.exports.del = function(req, res, next) {
  if(!req.params || !req.params.categories) {
    return next(new restify.MissingParameterError("Missing argument: you need to define at least 1 category"));
  }
  if(!req.params || !req.params.token) {
    return next(new restify.MissingParameterError("Missing argument: you need to define an access_token and an access_token_secret"));
  }
  async.waterfall([
    function deleteTweeter(cb) {
      Tweeter.findOne(
        {
          accessToken: req.params.access_token,
          accessTokenSecret: req.params.access_token_secret,
          categories:
          {
            $all: req.params.categories.toString().split(',')
          }
        }
      )
      .remove(cb);
    },
    function sendResponse(count, cb){
      if(count === 0) {
        return next(new restify.ResourceNotFoundError("No such tweeter"));
      }
      res.send(204);
      cb();
    }
  ], next);
};