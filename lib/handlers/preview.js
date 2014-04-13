'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');
var News = mongoose.model('News');

var formatNews = function(news){
  var formatedCategories = "";
  news.categories.forEach(function(news) {
    formatedCategories += "#" + news + " ";
  });
  var formatedNews = news.title + " " + news.url + " " + formatedCategories + " via @" + news.user;
  return formatedNews;
};

module.exports.get = function(req, res, next) {
  if(!req.params || !req.params.token) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define a token"));
  }
  async.waterfall([
    function getCategories(cb) {
      var query = Tweeter.find({twitterToken: req.params.token}, {"__v": false, "_id": false, "twitterToken": false});
      query.exec(cb);
    },
    function getNews(tweetCategories, cb) {
      var flatTweetCategories = [];
      var tweetCategoriesValues = [];
      for (var index in tweetCategories) {
        tweetCategoriesValues.push(tweetCategories[index].categories);
      }
      flatTweetCategories = flatTweetCategories.concat.apply(flatTweetCategories, tweetCategoriesValues);

      var query = News.find({categories: {$elemMatch: {$in: flatTweetCategories}}}, {"__v": false, "_id": false}).limit(10);
      query.exec(cb);
    },
    function formatizeNews(news, cb) {
      console.log(news);
      var formatedNews = [];
      news.forEach(function(news){
        formatedNews.push(formatNews(news));
      });
      cb(null, formatedNews);
    },
    function sendResponse(news, cb){
      res.send(news);
      cb();
    }
  ], function(err) {
    if(err){
      throw err;
    }
    next();
  });
};