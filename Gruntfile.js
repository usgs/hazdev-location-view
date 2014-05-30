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


	var requirePaths = {
		'mvc': '../node_modules/hazdev-webutils/src/mvc',
		'util': '../node_modules/hazdev-webutils/src/util',
		'leaflet': '../node_modules/leaflet/dist/leaflet-src'
	};

	grunt.initConfig({
		app: appConfig,
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
			}
		},
		concurrent: {
			scripts: ['jshint:scripts', 'mocha_phantomjs'],
			tests: ['jshint:tests', 'mocha_phantomjs'],
		},
		connect: {
			options: {
				hostname: '*'
			},
			dev: {
				options: {
					base: '<%= app.test %>',
					port: 8000,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, '.tmp'),
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
					port: 8081,
					keepalive: true,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, options.base)
						];
					}
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
		clean: {
			dev: ['<%= app.tmp %>', '.sass-cache'],
			build: ['<%= app.dist %>']
		},
		copy: {
			build: {
				expand: true,
				cwd: '<%= app.src %>',
				dest: '<%= app.dist %>',
				src: [
					'location-view-icons.png',
					'cursor.cur'
				]
			},

			leaflet: {
				expand: true,
				cwd: 'node_modules',
				src: ['leaflet/*'],
				dest: '<%=- app.dist %>'
			},
			'leaflet-images': {
				expand: true,
				cwd: 'node_modules/leaflet/dist',
				src: ['images/*'],
				dest: '<%= app.dist %>'
			},
			// This task copies leaflet images to the "dist/libs" folder and is
			// used during the build:webutils target
			'leaflet-images-webutils': {
				expand: true,
				cwd: 'node_modules/leaflet/dist',
				src: ['images/*'],
				dest: '<%= app.dist %>/libs/leaflet'
			},

			requirejs: {
				expand: true,
				cwd: 'node_modules',
				src: ['requirejs/*'],
				dest: '<%= app.dist %>/libs'
			},

			index: {
				expand: true,
				cwd: 'etc',
				src: ['index-dist.html'],
				dest: '<%= app.dist %>',
				rename: function () { return '<%= app.dist %>/index.html'; }
			},
			'index-all': {
				expand: true,
				cwd: 'etc',
				src: ['index-dist-all.html'],
				dest: '<%= app.dist %>',
				rename: function () { return '<%= app.dist %>/index.html'; }
			},
			'index-leaflet': {
				expand: true,
				cwd: 'etc',
				src: ['index-dist-leaflet.html'],
				dest: '<%= app.dist %>',
				rename: function () { return '<%= app.dist %>/index.html'; }
			},
			'index-webutils': {
				expand: true,
				cwd: 'etc',
				src: ['index-dist-webutils.html'],
				dest: '<%= app.dist %>',
				rename: function () { return '<%= app.dist %>/index.html'; }
			}
		},
		requirejs: {
			build: {
				options: {
					baseUrl: '<%= app.src %>',
					name: 'LocationView',
					out: '<%= app.dist %>/LocationView.js',
					paths: requirePaths,
					exclude: [
						'leaflet',
						'util/Util',
						'mvc/ModalView'
					]
				}
			},
			'build-webutils': {
				options: {
					baseUrl: '<%= app.src %>',
					name: 'LocationView',
					out: '<%= app.dist %>/LocationView.js',
					paths: requirePaths,
					exclude: [
						'leaflet',
					]
				}
			},
			'build-leaflet': {
				options: {
					baseUrl: '<%= app.src %>',
					name: 'LocationView',
					out: '<%= app.dist %>/LocationView.js',
					paths: requirePaths,
					exclude: [
						'util/Util',
						'mvc/ModalView'
					]
				}
			},
			'build-all': {
				options: {
					baseUrl: '<%= app.src %>',
					name: 'LocationView',
					out: '<%= app.dist %>/LocationView.js',
					paths: requirePaths,
					shim: {
						'leaflet': {
							exports: 'L'
						}
					}
				}
			},

			webutils: {
				options: {
					baseUrl: 'node_modules/hazdev-webutils/src',
					out: '<%= app.dist %>/libs/hazdev-webutils/webutils.js',
					name: 'webutils',
					create: true,
					include: [
						'util/Util',
						'mvc/ModalView'
					]
				}
			},
			leaflet: {
				options: {
					baseUrl: 'node_modules/leaflet/dist',
					out: '<%= app.dist %>/libs/leaflet/leaflet.js',
					name: 'leaflet',
					shim: {
						leaflet: {
							exports: 'L'
						}
					},
					paths: {
						leaflet: 'leaflet-src'
					},
					include: 'leaflet-src.js',
					// This is an exploit of the intended use of "wrap", but it exposes
					// a requirejs module accessible via "leaflet".
					wrap: {
						start: '',
						end: 'define(\'leaflet\',function(){return L;});'
					}
				}
			}
		},
		cssmin: {
			build: {
				expand: true,
				files: {
					'<%= app.dist %>/LocationView.css': [
						'<%= app.tmp %>/LocationView.css'
					]
				}
			},
			'build-leaflet': {
				expand: true,
				files: {
					'<%= app.dist %>/LocationView.css': [
						'node_modules/leaflet/dist/leaflet.css',
						'<%= app.tmp %>/LocationView.css'
					]
				}
			},
			'build-webutils': {
				expand: true,
				files: {
					'<%= app.dist %>/LocationView.css': [
						'node_modules/hazdev-webutils/src/mvc/ModalView.css',
						'<%= app.tmp %>/LocationView.css'
					]
				}
			},
			'build-all': {
				expand: true,
				files: {
					'<%= app.dist %>/LocationView.css': [
						'node_modules/leaflet/dist/leaflet.css',
						'node_modules/hazdev-webutils/src/mvc/ModalView.css',
						'<%= app.tmp %>/LocationView.css'
					]
				}
			},

			webutils: {
				expand: true,
				files: {
					'<%= app.dist %>/libs/hazdev-webutils/webutils.css': [
						'node_modules/hazdev-webutils/src/mvc/ModalView.css'
					]
				}
			},
			leaflet: {
				expand: true,
				files: {
					'<%= app.dist %>/libs/leaflet/leaflet.css': [
						'node_modules/leaflet/dist/leaflet.css'
					]
				}
			}
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

	grunt.registerTask('build', function (target) {
		// Common tasks
		var tasks = [
			'clean:build',
			'compass',
			'copy:build',

			'copy:requirejs'
		];

		if (arguments.length === 0) {
			// No target specified, build minimal dist
			Array.prototype.push.apply(tasks, [
				'cssmin:build',
				'requirejs:build',

				'requirejs:webutils',
				'cssmin:webutils',

				'requirejs:leaflet',
				'cssmin:leaflet',
				'copy:leaflet-images-webutils',

				'copy:index'
			]);
		} else if (target === 'leaflet') {
			// Leaflet target specified, build leaflet dist
			Array.prototype.push.apply(tasks, [
				'cssmin:build-leaflet',
				'requirejs:build-leaflet',
				'copy:leaflet-images',

				'requirejs:webutils',
				'cssmin:webutils',

				'copy:index-leaflet'
			]);
		} else if (target === 'webutils') {
			// Web utils specified, build webutils dist
			Array.prototype.push.apply(tasks, [
				'cssmin:build-webutils',
				'requirejs:build-webutils',

				'requirejs:leaflet',
				'cssmin:leaflet',
				'copy:leaflet-images-webutils',

				'copy:index-webutils'
			]);
		} else if (target === 'all') {
			// All specified, build full dist
			Array.prototype.push.apply(tasks, [
				'cssmin:build-all',
				'requirejs:build-all',
				'copy:leaflet-images',

				'copy:index-all'
			]);
		} else {
			grunt.warn('Invalid build target. Bailing out.');
			return;
		}

		// More common tasks
		// ...

		// Now run the loaded tasks
		grunt.task.run(tasks);
	});

	grunt.registerTask('dist', [
		'connect:dist'
	]);

};
