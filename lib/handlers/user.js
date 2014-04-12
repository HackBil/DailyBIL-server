'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');
var crypto = require('crypto');

var User = mongoose.model('User');

module.exports.post = function(req, res, next) {
  var token = crypto.randomBytes(32).toString('hex');
  console.log("creation");
  async.waterfall([
    function checkIntegreity(cb) {
      console.log("check integrity");
      if(!req.params.name) {
        console.log("integrity failed");
        cb(next(new restify.MissingArgumentError("Missing argument: need a name")));
      }
      cb();
    },
    function createUser(cb) {
      var user = new User();
      user.name = req.params.name;
      user.token = token;
      user.save(function(err) {
        cb(err);
      });
    },
    function sendResponse(cb) {
      res.send(202, {token: token});
      cb();
    }
  ], next);
};