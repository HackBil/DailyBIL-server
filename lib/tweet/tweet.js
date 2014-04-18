'use strict';

var Twit = require('twit');

var getUrlLength = require('./twitter_config').getUrlLength;

var formatNews = function(news){
  var formatedCategories = " ";
  news.categories.forEach(function(news) {
    formatedCategories += "#" + news + " ";
  });
  var user = "";
  var title = news.title;
  if (news.user) {
    user = "via @" + news.user;
  }

  var actualLength = title.length + getUrlLength() + formatedCategories.length + user.length + 1;

  if(actualLength > 140) {
    title = title.substring(0, title.length - (actualLength - 140));
  }

  var formatedNews = title + " " + news.url + formatedCategories + user;
  return formatedNews;
};



var sendTweet = function(news, tweeter) {
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


module.exports.sendTweet = sendTweet;
module.exports.formatNews = formatNews;
