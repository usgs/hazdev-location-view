 'use strict';

var config = require('./config');

 module.exports = {
  options: {
    jshintrc: '.jshintrc'
  },
  gruntfile: [
    'Gruntfile.js',
    'gruntconfig/**/*.js'
  ],
  scripts: [config.src + '/locationview/**/*.js'],
  tests: [config.test + '/**/*.js']
};