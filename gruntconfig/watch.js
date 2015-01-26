'use strict';

var config = require('./config');

module.exports = {
  compass: {
    files: [config.src + '/**/*.scss'],
    tasks: ['compass:dev']
  },
  scripts: {
    files: [config.src + '/**/*.js'],
    tasks: ['jshint:scripts', 'browserify', 'mocha_phantomjs']
  },
  tests: {
    files: [config.test + '/**/*.js'],
    tasks: ['jshint:tests', 'browserify', 'mocha_phantomjs']
  },
  images: {
    files: [config.src + '/*.cur', config.src + '/*.png'],
    tasks: ['copy:src']
  },
  html: {
    files: [config.test + '/**/*.html', config.test + '/**/*.css'],
    tasks: ['copy:test']
  },
  gruntfile: {
    files: ['Gruntfile.js'],
    tasks: ['jshint:gruntfile']
  }
};