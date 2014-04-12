'use strict';

var async = require('async');
var mongoose = require('mongoose');

var User = mongoose.model('User');

module.exports.get = function(req, res, next) {
  async.waterfall([
    function getUsers(cb) {
      User.find({}, cb);
    },
    function sendCatageories(users, cb) {
      users = users.map(function(user) {
        return user.name;
      });
      res.send(users);
      console.log("Getting users");
      cb();
    }
  ], next);
};