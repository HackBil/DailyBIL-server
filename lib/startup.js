'use strict';

var async = require('async');
var mongoose = require('mongoose');

var Tweeter = mongoose.model('Tweeter');

var listen = require('./listener').listen;

module.exports.start = function() {
  Tweeter.find({}, function(err, tweeters) {
    async.Each(tweeters, function(tweeter, cb) {
      listen(tweeter);
      cb();
    });
  });
};
