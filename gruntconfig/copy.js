'use strict';

var config = require('./config');

var copy = {
  src: {
    expand: true,
    cwd: config.src,
    src: ['images/*'],
    dest: config.build + '/' + config.src
  },
  test: {
    expand: true,
    cwd: config.test,
    src: ['**/*.html'],
    dest: config.build + '/' + config.test
  },

  // Need images for markers and some controls
  leaflet: {
    expand: true,
    cwd: process.cwd() + '/node_modules/leaflet/dist',
    src: ['leaflet.css', 'images/*'],
    dest: config.build + '/' + config.src
  }
};

module.exports = copy;
