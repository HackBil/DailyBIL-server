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
      var stringedUsers = "";
      users.forEach(function(category) {
        stringedUsers = stringedUsers + category.name + ",";
      });
      res.send(stringedUsers);
      console.log("Getting users");
      cb();
    }
  ], next);
};