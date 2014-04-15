'use strict';

module.exports.formatNews = function(news){
  var formatedCategories = "";
  news.categories.forEach(function(news) {
    formatedCategories += "#" + news + " ";
  });
  var user ="";
  if (news.user) {
    user = " via @" + news.user;
  }
  var formatedNews = news.title + " " + news.url + " " + formatedCategories + user;
  return formatedNews;
};
