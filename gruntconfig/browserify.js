'use strict';

var config = require('./config');

// Modules defined by this (hazdev-location-view) package
var EXPORTS = [
  'ConfidenceCalculator',
  'CoordinateControl',
  'GeocodeControl',
  'Geocoder',
  'GeolocationControl',
  'LocationControl',
  'LocationView',
  'PointControl',
  'RectangleControl',
  'RectangleCoordinateView',
  'RectangleModel',
  'RectangleOverlayView',
  'RegionView'
];

// Modules from other (external) packages
var EXTERNALS = [
  'leaflet',

  'mvc/Collection',
  'mvc/CollectinSelectBox',
  'mvc/CollectionTable',
  'mvc/DataTable',
  'mvc/DownloadView',
  'mvc/ModalView',
  'mvc/Model',
  'mvc/SelectView',
  'mvc/SortView',
  'mvc/View',
  'util/Events',
  'util/Util',
  'util/Xhr',
];

/**
 * Creates a bundle target configuration.
 *
 * @param options Function options see below for keys...
 *
 *      bundle       {String}  Name of browserify bundle target.
 *      destDir      {String}  Name of output directory in which to
 *                             place built files.
 *      sourceDir    {String}  Name of input directory to find source
 *                             files.
 *
 * @return A bundle object configuration
 */
var makeBundle = function (options) {
  return {
    src: options.sourceDir + '/' + options.bundle + '.js',
    dest: options.destDir + '/' + options.bundle + '.js',
    options: {
      external: EXPORTS.concat(EXTERNALS)
    }
  };
};


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src,
        process.cwd() + '/node_modules/hazdev-webutils/src'
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
      }),
      external: EXTERNALS
    }
  },

  // test bundle
  test: makeBundle({
    bundle: 'index',
    destDir: config.build + '/' + config.test,
    sourceDir: config.test
  })
};


// bundles for examples
[
  'js/CoordinateControlUITest',
  'js/GeocodeControlUITest',
  'js/GeocoderTest',
  'js/GeolocationControlUITest',
  'js/LocationControlUITest',
  'js/LocationViewUITest',
  'js/PointControlUITest',
  'js/RectangleControlUITest',
  'js/RegionViewUITest'
].forEach(function (bundle) {
  browserify[bundle] = makeBundle({
    bundle: bundle,
    destDir: config.build + '/' + config.example,
    sourceDir: config.example
  });
});


module.exports = browserify;