 'use strict';

var config = require('./config');

 module.exports = {
  options: {
    jshintrc: '.jshintrc'
  },
  gruntfile: ['Gruntfile.js'],
  scripts: [config.src + '/**/*.js'],
  tests: [config.test + '/**/*.js']
};