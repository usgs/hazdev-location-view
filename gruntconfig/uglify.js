'use strict';

var config = require('./config');

var uglify = {
  options: {
  },
  dist: {
    src: config.build + '/' + config.src + '/hazdev-location-view.js',
    dest: config.dist + '/hazdev-location-view.js'
  },
  leaflet: {
    src: config.build + '/' + config.src + '/lib/leaflet-0.7.7/leaflet.js',
    dest: config.dist + '/lib/leaflet-0.7.7/leaflet.js'
  }
};

module.exports = uglify;
