'use strict';

module.exports = (function () {
  var config = {
    browserify: require('./browserify'),
    compass: require('./compass'),
    connect: require('./connect'),
    jshint: require('./jshint'),
    mocha_phantomjs: require('./mocha_phantomjs'),
    watch: require('./watch'),

    tasks: [
      'grunt-browserify',
      'grunt-contrib-compass',
      'grunt-contrib-connect',
      'grunt-contrib-jshint',
      'grunt-mocha-phantomjs',
      'grunt-contrib-watch'
    ]
  };

  return config;
})();