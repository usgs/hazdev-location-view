'use strict';

module.exports = function (grunt) {
  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'dev',
    'uglify',
    'imagemin'
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
    'browserify:test',
    'copy:test',
    'connect:test',    // View
    'mocha_phantomjs', // Execute

    'watch'
  ]);

  grunt.registerTask('dev', [
    'browserify:source',
    'postcss:build',
    'copy:src',
    'copy:leaflet'
  ]);

  grunt.registerTask('dist', [
    'build',
    'copy:dist',
    'postcss:dist',
    'postcss:distleaflet',
    'connect:template',
    'configureProxies:dist',
    'connect:dist'
  ]);

  grunt.registerTask('test', [
    'dev',

    'browserify:test',
    'copy:test',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
