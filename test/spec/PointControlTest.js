/* global define, describe, it */
define([
	'chai',
	'PointControl',
	'leaflet',
	'sinon'
], function (
	chai,
	PointControl,
	L,
	sinon
) {
	'use strict';
	var expect = chai.expect;

	var testLoc1 = {
		place: 'world',
		latitude: 35.0,
		longitude: -118.0,
		method: 'foo',
		confidence: 'bar',
		accuracy: -1
	};

	var testLoc2 = {
		place: 'hello',
		latitude: 40.0,
		longitude: -105.0,
		method: 'baz',
		confidence: 'zap',
		accuracy: 1
	};

	describe('PointControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(PointControl).not.to.be.null;
				/* jshint +W030 */
			});
		});

		describe('initialize()', function () {
			var p = new PointControl();

			it('Can be instantiated', function () {
				expect(p).to.be.an.instanceof(PointControl);
			});

			it('Inherits from L.Control', function () {
				expect(p).to.be.an.instanceof(L.Control);
			});

			it('sets options on itself', function () {
				expect(p.options).to.be.an.instanceof(Object);
			});

			it('has proper default attributes', function () {
				/* jshint -W030 */
				expect(p._loc).to.be.null;
				expect(p._isEnabled).to.be.false;
				/* jshint +W030 */
				expect(p._marker.getLatLng().lat).to.equal(0.0);
				expect(p._marker.getLatLng().lng).to.equal(0.0);
			});
		});

		describe('setLocation()', function () {
			var p = new PointControl();

			it('notifies listeners by default', function () {
				var onSetLocation = sinon.spy();

				p.on('location', onSetLocation);
				p.setLocation({});

				expect(onSetLocation.callCount).to.equal(1);
			});

			it('suppresses notifications with silent option', function () {
				var onSetLocation = sinon.spy();

				p.on('location', onSetLocation);
				p.setLocation({}, {silent: true});

				expect(onSetLocation.callCount).to.equal(0);
			});

			it('passes correct location data to listeners', function () {
				var onSetLocation = sinon.spy();

				p.on('location', onSetLocation);
				p.setLocation(testLoc1);

				/* jshint  -W030 */
				expect(onSetLocation.alwaysCalledWithMatch(testLoc1)).to.be.true;
				/* jshint +W030 */
			});

		});

		describe('getLocation()', function () {

			it('returns null by default', function () {
				var p = new PointControl();
				var loc = p.getLocation();

				/* jshint -W030 */
				expect(loc).to.be.null;
				/* jshint +W030 */
			});

			it('returns the default location when specified', function () {
				var p = new PointControl({defaultLocation: testLoc1});
				var loc = p.getLocation();

				expect(loc).to.deep.equal(testLoc1);
			});

			it('returns the most recently set location', function () {
				var p = new PointControl({defaultLocation: testLoc1});

				expect(p.getLocation()).to.deep.equal(testLoc1);

				p.setLocation(testLoc2);
				expect(p.getLocation()).to.deep.equal(testLoc2);
			});
		});

		describe('onAdd()', function () {
			var p = new PointControl();
			var clickHandler = sinon.spy(p, '_toggleEnabled');
			var c = p.onAdd(L.map(document.createElement('div')));

			var getClickEvent = function () {
				var clickEvent = document.createEvent('MouseEvents');
				clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
				return clickEvent;
			};

			it('register a click handler in onAdd method', function () {
				expect(clickHandler.callCount).to.equal(0);

				c.dispatchEvent(getClickEvent());
				expect(clickHandler.callCount).to.equal(1);

				c.dispatchEvent(getClickEvent());
				expect(clickHandler.callCount).to.equal(2);
			});

			it('has a map after adding', function () {
				expect(p._map).to.be.an.instanceof(L.Map);
			});
		});

		describe('onRemove()', function () {
			var p = new PointControl(),
			    m = new L.Map(document.createElement('div'));

			p.onAdd(m);
			p.onRemove(m);

			it('should not have a map after removal', function () {
				/* jshint -W030 */
				expect(p._map).to.be.null;
				/* jshint +W030 */
			});
		});

	});
});
