'use strict';

var config = require('./config');

module.exports = {
  dev: {
    options: {
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      sassDir: config.src,
      specify: [
        config.src + '/hazdev-location-view.scss'
      ]
    }
  }
};