'use strict';

var config = require('./config');

// Modules defined by this (hazdev-location-view) package
var EXPORTS = [
  'ConfidenceCalculator',
  'CoordinateControl',
  'GeocodeControl',
  'Geocoder',
  'GeolocationControl',
  'LeafletShim',
  'LocationControl',
  'LocationView',
  'PointControl',
  'RectangleControl',
  'RectangleCoordinateView',
  'RectangleModel',
  'RectangleOverlayView',
  'RegionView'
];


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src,
        process.cwd() + '/node_modules/hazdev-webutils/src',
        process.cwd() + '/node_modules/leaflet/dist'
      ]
    }
  },

  // source bundle
  source: {
    src: [],
    dest: config.build + '/' + config.src + '/hazdev-location-view.js',
    options: {
      alias: EXPORTS.map(function (path) {
        return './' + config.src + '/' + path + ':' + path;
      })
    }
  },

  // test bundle
  test: {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: EXPORTS
    }
  }
};


module.exports = browserify;