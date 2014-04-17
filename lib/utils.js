'use strict';

var getUrlLength = require('./sender/twitter_config').getUrlLength;

module.exports.formatNews = function(news){
  var formatedCategories = "";
  news.categories.forEach(function(news) {
    formatedCategories += "#" + news + " ";
  });
  var user = "";
  var title = news.title;
  if (news.user) {
    user = " via @" + news.user;
  }

  var actualLength = title.length + formatedCategories.length + user.length + getUrlLength() + 3;

  if(actualLength > 140) {
    title = title.substring(0, title.length - (actualLength - 140));
  }

  var formatedNews = title + " " + news.url + " " + formatedCategories + user;
  return formatedNews;
};
