'use strict';

var config = require('./config'),
    browserify = {};

browserify.options = {
  browserifyOptions: {
    paths: [
      process.cwd() + '/' + config.src,
      process.cwd() + '/node_modules/hazdev-webutils/src'
    ]
  }
};

[
  'index'
].forEach(function (bundle) {
  var targetFile = config.build + '/' + config.test + '/' + bundle + '.js';
  var sourceFile = config.test + '/' + bundle + '.js';

  browserify[bundle] = {files: {}};
  browserify[bundle].files[targetFile] = [sourceFile];
});
console.log(browserify);

module.exports = browserify;
