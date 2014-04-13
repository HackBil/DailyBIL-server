'use strict';

var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');

module.exports.start = function(){
  Tweeter.find({}, function(err, tweeters){
    async.forEach(tweeters, function(tweeter){

    });
  });
};