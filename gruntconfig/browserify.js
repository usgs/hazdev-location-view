'use strict';

var config = require('./config');

var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src,
        process.cwd() + '/node_modules/hazdev-webutils/src'
      ]
    }
  }
};


/**
 * Adds a bundle target to Grunt configuration. Modifies global browserify
 * object.
 *
 * @param options Function options see below for keys...
 *
 *      bundle       {String}  Name of browserify bundle target.
 *      destDir      {String}  Name of output directory in which to
 *                             place built files.
 *      sourceDir    {String}  Name of input directory to find source
 *                             files.
 */
var makeBundle = function (options) {
  browserify[options.bundle] = {
    src: options.sourceDir + '/' + options.bundle + '.js',
    dest: options.destDir + '/' + options.bundle + '.js'
  };
};

// bundles for examples
[
  'js/CoordinateControlUITest',
  'js/GeocodeControlUITest',
  'js/GeocoderTest',
  'js/GeolocationControlUITest',
  'js/LocationControlUITest',
  'js/PointControlUITest',
  'js/RectangleControlUITest'
].forEach(function (bundle) {
  makeBundle({
    bundle: bundle,
    destDir: config.build + '/' + config.example,
    sourceDir: config.example
  });
});

// bundles for tests
[
  'index',
  'js/LocationViewUITest',
  'js/RegionViewUITest'
].forEach(function (bundle) {
  makeBundle({
    bundle: bundle,
    destDir: config.build + '/' + config.test,
    sourceDir: config.test
  });
});

// bundles for dist
[
  'LocationView',
  'RegionView'
].forEach(function (bundle) {
  makeBundle({
    bundle: bundle,
    destDir: config.build + '/' + config.src,
    sourceDir: config.src
  });
});

module.exports = browserify;