'use strict';

module.exports.formatNews = function(news){
  var formatedCategories = "";
  news.categories.forEach(function(news) {
    formatedCategories += "#" + news + " ";
  });
  var formatedNews = news.title + " " + news.url + " " + formatedCategories + " via @" + news.user;
  return formatedNews;
};
