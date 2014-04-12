'use strict';

// Load configuration and initialize server
var restify = require('restify');
var mongoose = require('mongoose');

var config = require('./config.js');

var lib = require('./lib/');

// Connect mongoose
mongoose.connect(config.mongoUrl);

// Create server
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.CORS());
server.use(restify.fullResponse());

server.get('/categories', lib.handlers.categories.get);
server.post('/news', lib.handlers.news.post);
server.post('/tupeuxpastrouver/user', lib.handlers.user.post);

// Expose the server
module.exports = server;
