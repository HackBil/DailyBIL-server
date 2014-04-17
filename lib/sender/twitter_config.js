'use strict';

var Twit = require('twit');

var urlLength = 25;

module.exports.start = function() {
  setInterval(function(){
    var Tweet = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    Tweet.get('help/configuration.json', function(err, reply) {
      if(err) {
        throw err;
      }
      urlLength = Math.max(reply.short_url_length_https, reply.short_url_length);
      console.log("Getting urlLength", urlLength);
    });
  }, 24 * 3600 * 1000); //Every day
};

module.exports.getUrlLength = function() {
  return urlLength;
};
