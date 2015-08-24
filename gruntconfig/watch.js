'use strict';

var config = require('./config');

module.exports = {
  scss: {
    files: [config.src + '/locationview/**/*.scss'],
    tasks: ['postcss:build']
  },
  scripts: {
    files: [config.src + '/locationview/**/*.js'],
    tasks: ['jshint:scripts', 'browserify:source', 'mocha_phantomjs']
  },
  tests: {
    files: [config.test + '/**/*.js'],
    tasks: ['jshint:tests', 'browserify:test', 'mocha_phantomjs']
  },
  images: {
    files: [config.src + '/locationview/images/**/*'],
    tasks: ['copy:src']
  },
  html: {
    files: [
      config.test + '/**/*.html',
      config.test + '/**/*.css'
    ],
    tasks: ['copy:test']
  },
  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: ['jshint:gruntfile']
  }
};