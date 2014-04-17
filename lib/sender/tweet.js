'use strict';

var Twit = require('twit');

var formatNews = require('../utils.js').formatNews;

module.exports.sendTweet = function(news, tweeter) {
  var Tweet = new Twit({
    consumer_key: tweeter.accessToken,
    consumer_secret: tweeter.accessTokenSecret,
    access_token: process.env.API_TOKEN,
    access_token_secret: process.env.API_TOKEN_SECRET
  });

  Tweet.post('statuses/update', {status: formatNews(news)}, function(err, reply) {
    console.log(reply);
    if(err) {
      console.log(err);
      throw err;
    }
  });

};