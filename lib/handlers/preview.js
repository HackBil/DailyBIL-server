'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');

var formatNews = require('../tweet/tweet').formatNews;

module.exports.get = function(req, res, next) {
  if(!req.params || !req.params.categories) {
    return next(new restify.InvalidArgumentError("Missing argument: you need to define at least 1 categories"));
  }
  async.waterfall([
    function getNews(cb) {
      var categories = decodeURI(req.params.categories).split(",");
      var query = News.find({categories: {$all: categories}}, {"__v": false}).limit(10);
      query.exec(cb);
    },
    function formatizeNews(news, cb) {
      var formatedNews = news.map(function(news){
        return formatNews(news);
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