'use strict';

var config = require('./config');

module.exports = {
  options: {
    hostname: '*'
  },
  dev: {
    options: {
      port: 8000,
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        config.test,
        config.src,
        'node_modules'
      ]
    }
  }
};