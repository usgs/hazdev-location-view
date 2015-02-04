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
      ],
      open: 'http://localhost:8000/example.html'
    }
  },
  test: {
    options: {
      port: 8001,
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        'node_modules'
      ],
      open: 'http://localhost:8001/test.html'
    }
  },
  dist: {
    options: {
      port: 8002,
      keepalive: true,
      base: [
        config.example,
        config.dist
      ],
      open: 'http://localhost:8002/example.html'
    }
  }
};