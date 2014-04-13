'use strict';

var restify = require('restify');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

module.exports.post = function(req, res, next) {

}