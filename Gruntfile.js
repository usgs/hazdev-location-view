'use strict';

var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

	// Load grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// App configuration, used throughout
	var appConfig = {
		src: 'src',
		test: 'test',
		tmp: '.tmp',
		dist: 'dist'
	};

	// TODO :: Read this from .bowerrc
	var bowerConfig = {
		directory: 'bower_components'
	};

	grunt.initConfig({
		app: appConfig,
		bower: bowerConfig,
		watch: {
			scripts: {
				files: ['<%= app.src %>/**/*.js'],
				tasks: ['concurrent:scripts']
			},
			sass: {
				files: ['<%= app.src %>/**/*.scss'],
				tasks: ['compass:dev']
			},
			tests: {
				files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
				tasks: ['concurrent:tests']
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['jshint:gruntfile']
			},
			// TODO :: Don't need this once build process is figured out
			dist: {
				files: ['Gruntfile.js'],
				tasks: ['build']
			}
		},
		concurrent: {
			scripts: ['jshint:scripts', 'mocha_phantomjs'],
			tests: ['jshint:tests', 'mocha_phantomjs'],

			// Tasks for building distributable
			dist_copy: [
				'copy:dist',
				'copy:dist_index'
			]
		},
		connect: {
			options: {
				hostname: 'localhost'
			},
			dev: {
				options: {
					base: '<%= app.test %>',
					components: bowerConfig.directory,
					port: 8000,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'bower_components'),
							mountFolder(connect, 'node_modules'),
							mountFolder(connect, options.base),
							mountFolder(connect, appConfig.src)
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= app.dist %>',
					port: 8081
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: ['Gruntfile.js'],
			scripts: ['<%= app.src %>/**/*.js'],
			tests: ['<%= app.test %>/**/*.js']
		},
		compass: {
			dev: {
				options: {
					sassDir: '<%= app.src %>',
					cssDir: '<%= app.tmp %>',
					environment: 'development'
				}
			}
		},
		mocha_phantomjs: {
			all: {
				options: {
					urls: [
						'http://localhost:<%= connect.dev.options.port %>/index.html'
					]
				}
			}
		},
		open: {
			dist: { path: 'http://<%= connect.options.hostname %>:' +
						'<%= connect.dist.options.port %>/index.html'}
		},
		clean: {
			dev: ['<%= app.tmp %>', '.sass-cache'],
			dist: ['<%= app.dist %>']
		},
		copy: {
			dist: {
				expand: true,
				cwd: '.',
				dest: '<%= app.dist %>/ex_resources',
				src: [
					'node_modules/leaflet/dist/leaflet.css',
					'<%= app.test %>/css/LocationViewUITest.css'
				],
				rename: function (dest, src) {
					return dest + '/' + require('path').basename(src);
				}
			},
			dist_index: {
				expand: true,
				cwd: '<%= app.test %>',
				dest: '<%= app.dist %>',
				src: ['LocationViewUITest.html'], // Do not expand this. See rename...
				rename: function (dest, src) {
					return dest + '/index.html'
				}
			}
		},
		replace: {
		}
	});

	grunt.event.on('watch', function (action, filepath) {
		// Only lint the file that actually changed
		grunt.config(['jshint', 'scripts'], filepath);
	});

	grunt.registerTask('test', [
		'connect:dev',
		'mocha_phantomjs'
	]);

	grunt.registerTask('default', [
		'connect:dev',
		'compass:dev',
		'mocha_phantomjs',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist_copy',
	]);

	grunt.registerTask('build-debug', [
		'build',
		'connect:dist',
		'open:dist',
		'watch:dist' // TODO :: Don't need this once build process is figured out
	]);
};
