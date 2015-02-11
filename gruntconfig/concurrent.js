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
    'cssmin',
    'uglify',
    'imagemin'
  ]
};

module.exports = concurrent;