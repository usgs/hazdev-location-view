'use strict';

// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5 internal IsCallable
			throw new TypeError('object to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    NOP = function () {},
		    fBound;

		fBound = function () {
			return fToBind.apply(
					(this instanceof NOP && oThis ? this : oThis),
					aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		NOP.prototype = this.prototype;
		fBound.prototype = new NOP();

		return fBound;
	};
}


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
