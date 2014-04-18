'use strict';

// Load configuration and initialize server
var restify = require('restify');
var mongoose = require('mongoose');

var config = require('./config.js');

var lib = require('./lib/');
var logger = require('./lib/middlewares/logger');

// Connect mongoose
console.log("using", config.mongoUrl);
mongoose.connect(config.mongoUrl);

// Create server
var server = restify.createServer();

if(process.env.NODE_ENV !== 'test') {
  server.use(logger);
}

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.CORS());
server.use(restify.fullResponse());

server.get('/categories', lib.handlers.categories.get);
server.get('/users', lib.handlers.users.get);

server.post('/news', lib.handlers.news.post);
server.get('/news', lib.handlers.news.get);

server.post('/tweeter', lib.handlers.tweeter.post);
server.get('/tweeter', lib.handlers.tweeter.get);
server.del('/tweeter', lib.handlers.tweeter.del);

server.get('/preview', lib.handlers.preview.get);


// Expose the server
module.exports = server;
