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
        config.example,
        config.build + '/' + config.src
      ]
    }
  },
  test: {
    options: {
      port: 8001,
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        'node_modules'
      ]
    }
  },
  dist: {
    options: {
      port: 8002,
      keepalive: true,
      base: [
        config.example,
        config.dist
      ]
    }
  }
};