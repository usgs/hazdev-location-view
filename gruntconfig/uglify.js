'use strict';

var config = require('./config');

var uglify = {
  build: {
    files: {
    }
  }
};

[
  'LocationView',
  'RegionView',
  'index'
].forEach(function (target) {
  uglify.build.files[config.dist + '/' + target + '.js'] = [
    config.build + '/' +
    config.src + '/' +
    target + '.js'
  ];
});

module.exports = uglify;