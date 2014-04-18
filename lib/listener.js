'use strict';

var mongoose = require('mongoose');

var News = mongoose.model('News');

var sendTweet = require('./tweet/tweet').sendTweet;

module.exports.listen = function(tweeter) {
  var interval = 2 * 3600 * 1000;
  setInterval(
    News.find({categories: {$all: tweeter.categories}, usedBy: {$not: {$in: tweeter._id}}, $orderby: { age : -1 }}, function(err, news) {
      if(err) {
        throw err;
      }
      if(news.length > 0) {
        sendTweet(news[0], tweeter);
        news.usedBy.push(tweeter._id);
        news.markModified('usedBy');
        if(news.length -1 > 10) {
          interval = interval / 2;
        }
        else {
          interval = interval * 2;
        }
      }
    }), interval
  );
};