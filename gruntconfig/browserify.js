'use strict';

var config = require('./config'),
    browserify = {};

browserify.options = {
  browserifyOptions: {
    debug: true,
    paths: [
      process.cwd() + '/' + config.src,
      process.cwd() + '/node_modules/hazdev-webutils/src'
    ]
  }
};

[
  'index',
  'js/LocationViewUITest',
  'js/RegionViewUITest',

  'js/CoordinateControlUITest',
  'js/GeocodeControlUITest',
  'js/GeocoderTest',
  'js/GeolocationControlUITest',
  'js/LocationControlUITest',
  'js/PointControlUITest',
  'js/RectangleControlUITest'
].forEach(function (bundle) {
  var targetFile = config.build + '/' + config.test + '/' + bundle + '.js';
  var sourceFile = config.test + '/' + bundle + '.js';

  browserify[bundle] = {files: {}};
  browserify[bundle].files[targetFile] = [sourceFile];
});

module.exports = browserify;
