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
        config.build + '/' + config.example
      ]
    }
  },
  test: {
    options: {
      port: 8001,
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src
      ]
    }
  },
  dist: {
    port: 8002,
    keepalive: true,
    base: [
      config.dist
    ]
  }
};