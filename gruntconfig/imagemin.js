'use strict';

var config = require('./config');

var imagemin = {
  dist: {
    files: [{
      expand: true,
      cwd: config.build + '/' + config.src,
      src: ['images/*'],
      dest: config.dist
    }]
  }
};

module.exports = imagemin;