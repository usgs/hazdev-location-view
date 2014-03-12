/* global define, describe, it, before, after*/
define([
	'chai',
	'GeocodeControl',
	'leaflet',
	'sinon'
], function (
	chai,
	GeocodeControl,
	L,
	sinon
) {
	'use strict';
	var expect = chai.expect;

	function getKeyboardEvent(type, keyCode) {
		var ev = document.createEvent('KeyboardEvent');

		if (typeof ev.initKeyEvent === 'function') {
		// https://developer.mozilla.org/en-US/docs/Web/API/event.initKeyEvent
			ev.initKeyEvent(
				type,
				true, // bubble
				true, // cancelable
				document.defaultView, // view
				false, // ctrl
				false, // alt
				false, // shift
				false, // meta
				keyCode, // keyCode
				0 // charCode
			);
		} else {
		// http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key
			Object.defineProperty(ev, 'keyCode', {
				get: function() {
					return keyCode;
				}
			});
			Object.defineProperty(ev, 'which', {
			get: function() {
				return keyCode;
				}
			});

			ev.initKeyboardEvent(
				type, // type
				true, // bubble
				true, // cancelable
				document.defaultView, // view
				null, // key identifier
				null, // location
				null //modifiers
			);
		}
		return ev;
	}

	describe('GeocodeControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(GeocodeControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('initialize()', function () {
			var G = new GeocodeControl();

			it('Can be instantiated', function () {
				expect(G).to.be.an.instanceof(GeocodeControl);
			});

			it('Inherits from L.Control', function () {
				expect(G).to.be.an.instanceof(L.Control);
			});

			it('sets options on itself', function () {
				expect(G.options).to.be.an.instanceof(Object);
			});

		});


		describe('setLocation()', function () {
			it('sets its location', function () {
				var loc = {};
				var G = new GeocodeControl();
				G.setLocation(loc);
				expect(G._loc).to.equal(loc);
			});
		});

		describe('getLocation()', function () {
			it('can get its location', function () {
				var loc = {};
				var G = new GeocodeControl();
				G._loc = loc;
				expect(G.getLocation()).to.equal(loc);
			});
		});

		describe('onAdd()', function () {
			var G = new GeocodeControl();

			it('Check for map', function () {
				/* jshint -W030 */
				expect(G._map).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('_onKeyUp()', function (){
			//This will be done with an app at a later date
			var G = new GeocodeControl(),
			    textInput,
			    spy;

			G.onAdd(null);
			textInput = G._textInput;

			before(function () {
				spy = sinon.spy(G, '_doGeocode');
			});

			after(function () {
				spy.restore();
			});

			it('Does not geocode when user presses enter key if there is no value',
					function () {
				textInput.value = '';
				textInput.dispatchEvent(getKeyboardEvent('keyup', 13));
				expect(spy.called).to.equal(false);
			});

			it('geocodes when user presses enter key and there is a value',
					function () {
				textInput.value = 'test';
				textInput.dispatchEvent(getKeyboardEvent('keyup', 13));
				expect(spy.called).to.equal(true);
			});

		});

	});

});
