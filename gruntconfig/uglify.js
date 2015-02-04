'use strict';

var config = require('./config');

var uglify = {
  options: {
  },
  dist: {
    src: config.build + '/' + config.src + '/hazdev-location-view.js',
    dest: config.dist + '/hazdev-location-view.js'
  }
};

module.exports = uglify;