'use strict';

require('../app.js');
var autoload = require('auto-load');

// Autoload models first
autoload("../lib/models");

// Return all files
module.exports = autoload(__dirname);

