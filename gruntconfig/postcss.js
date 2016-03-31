'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    postcssImport = require('postcss-import'),
    precss = require('precss');

var config = require('./config'),
    CWD = '.';

var postcss = {

  build: {
    options: {
      map: true,
      processors: [
        postcssImport({
          path: [
            CWD + '/' + config.src,
            CWD + '/node_modules/leaflet/dist',
            CWD + '/node_modules/hazdev-webutils/src'
          ]
        }),
        precss(),
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
  },

  distleaflet: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/lib/leaflet-0.7.7/leaflet.css',
    dest: config.dist + '/lib/leaflet-0.7.7/leaflet.css'
  }
};

module.exports = postcss;
