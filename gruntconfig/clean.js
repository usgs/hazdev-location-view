'use strict';

var config = require('./config');

var clean = {
  build: [config.build, '.sass-cache'],
  dist: ['dist']
};

module.exports = clean;