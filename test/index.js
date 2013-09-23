require.config({
	baseUrl: '..',
	paths: {
		mocha: 'mocha/mocha',
		chai: 'chai/chai',
		mvc: '/hazdev-webutils/src/mvc',
		util: '/hazdev-webutils/src/util',
		leaflet: '/leaflet/dist/leaflet-src',
		sinon: '/sinon/pkg/sinon'
	},
	shim: {
		mocha: {
			exports: 'mocha'
		},
		chai: {
			deps: ['mocha'],
			exports: 'chai'
		},
		leaflet: {
			exports: 'L'
		},
		sinon: {
			exports: 'sinon'
		}
	}
});

require([
	'mocha',
], function (
	mocha
) {
	'use strict';

	mocha.setup('bdd');

	// Add each test class here as they are implemented
	require([
		'spec/LocationViewTest',
		'spec/LocationControlTest',
		'spec/GeocodeControlTest',
		'spec/PointControlTest',
		'spec/CoordinateControlTest',
		'spec/ConfidenceCalculatorTest',
		'spec/GeocoderTest'
	], function (
	) {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
