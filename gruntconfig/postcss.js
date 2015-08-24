'use strict';

var autoprefixer = require('autoprefixer-core'),
    cssnano = require('cssnano'),
    precss = require('precss');

var config = require('./config');

var postcss = {

  build: {
    options: {
      map: true,
      processors: [
        precss({
          path: [
            process.cwd() + '/' + config.src,
            process.cwd() + '/node_modules/leaflet/dist',
            process.cwd() + '/node_modules/hazdev-webutils/src'
          ]
        }),
        autoprefixer({'browsers': 'last 2 versions'}), // vendor prefix as needed
      ]
    },
    src: config.src + '/hazdev-location-view.scss',
    dest: config.build + '/' + config.src + '/hazdev-location-view.css'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/hazdev-location-view.css',
    dest: config.dist + '/hazdev-location-view.css'
  }
};

module.exports = postcss;
