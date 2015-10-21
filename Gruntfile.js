'use strict';

module.exports = function (grunt) {
  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'dev',
    'concurrent:build'
  ]);

  grunt.registerTask('default', [
    'clean',

    // Sources
    'dev',             // Build
    'postcss:build',
    'connect:template',
    'configureProxies:dev',
    'connect:dev',     // View

    // Tests
    'concurrent:test', // Build
    'connect:test',    // View
    'mocha_phantomjs', // Execute

    'watch'
  ]);

  grunt.registerTask('dev', [
    'concurrent:dev'
  ]);

  grunt.registerTask('dist', [
    'build',
    'postcss:dist',
    'connect:template',
    'configureProxies:dist',
    'connect:dist'
  ]);

  grunt.registerTask('test', [
    'dev',

    'concurrent:test',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
