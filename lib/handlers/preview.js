'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');
var News = mongoose.model('News');

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
      console.log(tweetCategories);
      var query = News.find({categories: {$elemMatch: {$in: tweetCategories}}}, {"__v": false, "_id": false}).limit(10);
      query.exec(cb);
    },
    function formatizeNews(news, cb) {
      console.log(news);
      var formatedNews = [];
      news.forEach(function(news){
        formatedNews.push(news.title + " " + news.url + news.categories.toString().split(" ") + " via " + news.user);
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