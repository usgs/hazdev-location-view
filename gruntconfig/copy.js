'use strict';

var config = require('./config'),
    node_modules = process.cwd() + '/node_modules';

var copy = {
  src: {
    expand: true,
    cwd: config.src,
    src: ['*.cur', '*.png'],
    dest: config.build + '/' + config.src
  },
  test: {
    expand: true,
    cwd: config.test,
    src: ['**/*.html'],
    dest: config.build + '/' + config.test
  },
  leaflet: {
    expand: true,
    cwd: node_modules + '/leaflet/dist',
    src: ['**/leaflet-src.js', '**/leaflet.css', 'images/*'],
    dest: config.build + '/' + config.src + '/leaflet'
  },
  webutils: {
    expand: true,
    cwd: node_modules + '/hazdev-webutils/src',
    src: ['mvc/**/*.css', 'util/**/*.css'],
    dest: config.build + '/' + config.src
  },
  mocha: {
    expand: true,
    cwd: node_modules + '/mocha',
    src: ['mocha.js', 'mocha.css'],
    dest: config.build + '/' + config.test + '/mocha'
  }
};

module.exports = copy;