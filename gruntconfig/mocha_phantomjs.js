'use strict';

var config = require('./connect').dev.options;

module.exports = {
  all: {
    options: {
      urls: [
        'http://localhost:' + config.port + '/index.html'
      ]
    }
  }
};