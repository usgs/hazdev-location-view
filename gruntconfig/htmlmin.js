'use strict';

var config = require('./config');

var htmlmin = {
  options: {
    collapseWhitespace: true,
    removeComments: true
  },
  dist: {
    files: [{
      expand: true,
      cwd: config.build + '/' + config.test,
      src: ['LocationViewUITest.html', 'RegionViewUITest.html'],
      dest: config.dist
    }]
  }
};

module.exports = htmlmin;