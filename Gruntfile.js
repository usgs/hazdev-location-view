'use strict';

module.exports = function (grunt) {
  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  /**
   * Checksk whether or not a task has run yet in the current grunt runtime.
   *
   * @param task {String} The name of the task to Checksk
   *
   * @return True of the task has not yet run, false if the task has already
   *         run in this grunt runtime.
   */
  var taskNotRun = function (task) {
    try {
      grunt.task.requires(task);
      return false; // Task has already run
    } catch (e) {
      return true; // Task has not yet run
    }
  };

  /**
   * Creates a task function that executes a configurable list of tasks that
   * have not yet run in the current grunt runtime.
   *
   * @param tasks {Array} An array of task names to potentially run.
   */
  var taskList = function (tasks) {
    return function () {
      var t = tasks.filter(taskNotRun);
      grunt.task.run(t);
    };
  };

  grunt.registerTask('build', taskList([
    'dev',
    'cssmin',
    'uglify',
    'imagemin'
  ]));

  grunt.registerTask('default', taskList([
    'clean',
    'dev',
    'connect:dev',
    'test',
    'watch'
  ]));

  grunt.registerTask('dev', taskList([
    'browserify',
    'compass',
    'copy',
  ]));

  grunt.registerTask('dist', taskList([
    'build',
    'connect:dist'
  ]));

  grunt.registerTask('test', taskList([
    'dev',
    'connect:test',
    'mocha_phantomjs'
  ]));
};