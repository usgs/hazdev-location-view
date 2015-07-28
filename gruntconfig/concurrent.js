'use strict';


var concurrent = {
  dev: [
    'browserify:source',
    'compass',
    'copy:src',
    'copy:leaflet'
  ],
  test: [
    'browserify:test',
    'copy:test'
  ],
  build: [
    'uglify',
    'imagemin'
  ]
};

module.exports = concurrent;