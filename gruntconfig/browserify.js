'use strict';

var config = require('./config');

// Modules defined by this (hazdev-location-view) package
var EXPORTS = [
  'locationview/ConfidenceCalculator',
  'locationview/CoordinateControl',
  'locationview/GeocodeControl',
  'locationview/Geocoder',
  'locationview/GeolocationControl',
  'locationview/LocationControl',
  'locationview/LocationView',
  'locationview/PointControl',
  'locationview/RectangleControl',
  'locationview/RectangleCoordinateView',
  'locationview/RectangleModel',
  'locationview/RectangleOverlayView',
  'locationview/RegionView'
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
        return './' + config.src + '/' + path + '.js:' + path;
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