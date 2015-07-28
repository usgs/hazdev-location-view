'use strict';

module.exports = (function () {
  var config = {
    browserify: require('./browserify'),
    clean: require('./clean'),
    compass: require('./compass'),
    concurrent: require('./concurrent'),
    connect: require('./connect'),
    copy: require('./copy'),
    imagemin: require('./imagemin'),
    jshint: require('./jshint'),
    mocha_phantomjs: require('./mocha_phantomjs'),
    uglify: require('./uglify'),
    watch: require('./watch'),
    postcss: require('./postcss'),

    tasks: [
      'grunt-browserify',
      'grunt-concurrent',
      'grunt-contrib-clean',
      'grunt-contrib-compass',
      'grunt-contrib-connect',
      'grunt-contrib-copy',
      'grunt-contrib-imagemin',
      'grunt-contrib-jshint',
      'grunt-mocha-phantomjs',
      'grunt-contrib-uglify',
      'grunt-contrib-watch',
      'grunt-postcss'
    ]
  };

  return config;
})();
