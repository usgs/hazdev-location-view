'use strict';

module.exports = (function () {
  var config = {
    browserify: require('./browserify'),
    clean: require('./clean'),
    connect: require('./connect'),
    copy: require('./copy'),
    jshint: require('./jshint'),
    mocha_phantomjs: require('./mocha_phantomjs'),
    uglify: require('./uglify'),
    watch: require('./watch'),
    postcss: require('./postcss'),

    tasks: [
      'grunt-browserify',
      'grunt-connect-proxy',
      'grunt-connect-rewrite',
      'grunt-contrib-clean',
      'grunt-contrib-connect',
      'grunt-contrib-copy',
      'grunt-contrib-jshint',
      'grunt-mocha-phantomjs',
      'grunt-contrib-uglify',
      'grunt-contrib-watch',
      'grunt-postcss'
    ]
  };

  return config;
})();
