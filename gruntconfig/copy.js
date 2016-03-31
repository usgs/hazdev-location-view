'use strict';

var config = require('./config');

var copy = {
  src: {
    expand: true,
    cwd: config.src + '/locationview',
    src: ['images/*'],
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
    cwd: 'node_modules/leaflet/dist',
    dest: config.build + '/' + config.src + '/lib/leaflet-0.7.7',
    rename: function (dest, src) {
      var newName;

      // swap -src version to be default and add -min to compressed version
      // this is nice for debugging but allows production to use default
      // version as compressed
      newName = src.replace('leaflet.js', 'leaflet-min.js');
      newName = newName.replace('leaflet-src.js', 'leaflet.js');

      return dest + '/' + newName;
    },
    src: [
      '**/*'
    ]
  },

  dist: {
    expand: true,
    cwd: config.build + '/' + config.src + '/lib',
    dest: config.dist + '/lib',
    src: [
      '**/*',
      '!**/*.css',
      '!**/*.js'
    ]
  }
};

module.exports = copy;
