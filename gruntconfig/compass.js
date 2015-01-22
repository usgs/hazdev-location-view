'use strict';

var config = require('./config');

module.exports = {
  dev: {
    options: {
      sassDir: config.src,
      cssDir: config.build,
      environment: 'development'
    }
  }
};