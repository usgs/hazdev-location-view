'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    src: config.build + '/' + config.src + '/hazdev-location-view.css',
    dest: config.dist + '/hazdev-location-view.css'
  }
};

module.exports = cssmin;