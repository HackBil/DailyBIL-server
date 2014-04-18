'use strict';

var connect = require('connect');


var customLogger = function(tokens, req, res) {
  // Don't log /status, too much traffic.
  if(req.url === "/status") {
    return;
  }

  // Don't log OPTIONS call, CORS.
  if(req.method === "OPTIONS") {
    return;
  }

  var status = res.statusCode;
  var color = 32;
  var error = "";
  if (status >= 500) {
    color = 31;
    error = res._body;
  }
  else if (status >= 400){
    color = 33;
    error = res._body;
  }
  else if (status >= 300) {
    color = 36;
  }

  return '\x1b[90m' + req.method + ' ' + (req.user ? req.user.email + ':' : '') + req.url + ' ' + '\x1b[' + color + 'm' + res.statusCode + ' \x1b[90m' + (new Date() - req._startTime) + 'ms' + '\x1b[0m' + ' ' + error;
};


module.exports = connect.logger(customLogger);
module.exports.customLogger = customLogger;
