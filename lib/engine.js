'use strict';

var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');
var News = mongoose.model('News');
var ObjectId = mongoose.Schema.Types.ObjectId;

var sendTweet = require('./sender/tweet').sendTweet;

module.exports.start = function(){
  setInterval(function(){
    Tweeter.find({}, function(err, tweeters) {
      if(err) {
        throw err;
      }
      async.Each(tweeters, function(tweeter, cb) {
        News.find({categories: {$all: tweeter.categories}, usedBy: {$not: {$in: new ObjectId(tweeter._id)}}}, function(err, news) {
          if(err) {
            throw err;
          }
          sendTweet(news, tweeter);
          news.usedBy.push(new ObjectId(tweeter._id));
          news.save(cb);
        });
      });
    });

  }, 2 * 3600 * 1000);
};