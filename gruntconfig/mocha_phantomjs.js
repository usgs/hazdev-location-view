'use strict';

var config = require('./connect').test.options;

module.exports = {
  all: {
    options: {
      urls: [
        'http://localhost:' + config.port + '/test.html'
      ]
    }
  }
};