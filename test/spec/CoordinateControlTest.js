/* global define, describe, it */
define([
	'chai',
	'CoordinateControl',
	'leaflet',
	'sinon'
], function (
	chai,
	CoordinateControl,
	L,
	sinon
) {
	'use strict';
	var expect = chai.expect;

	var kingfieldME = {
		'place': 'test',
		'longitude': -70.1,
		'latitude': 45,
		'method': CoordinateControl.METHOD,
		'confidence': 'high',
		'accuracy': 12
	};

	var boulderCO = {
		'place': 'test',
		'longitude': -105.3,
		'latitude': 40,
		'method': CoordinateControl.METHOD,
		'confidence': 'high',
		'accuracy': 12
	};

	var control = new CoordinateControl({
		'location': kingfieldME,
		'position': 'topleft'
	});

	var mapDiv = L.DomUtil.create('div', 'map'),
			baseURL = 'http://{s}.tiles.mapbox.com/v3/bozdoz.map-z05i4vdt/{z}/{x}/{y}.png',
			base = L.tileLayer(baseURL),
			map = L.map(mapDiv, {layers: [base]}).setView([54.9682, -112.675], 5);


	var getClickEvent = function () {
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
		return clickEvent;
	};

	describe('CoordinateControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(CoordinateControl).to.not.be.null;
				/* jshint +W030 */
			});

			it('Can be instantiated', function () {

				/* jshint -W030 */
				expect(control.place).to.not.be.null;
				expect(control.longitude).to.not.be.null;
				expect(control.latitude).to.not.be.null;
				expect(control.method).to.not.be.null;
				expect(control.confidence).to.not.be.null;
				expect(control.accuracy).to.not.be.null;
				/* jshint +W030 */
			});
		});


		describe('Coordinate Control', function () {

			it('Can be added', function () {
				map.addControl(control);
				/* jshint -W030 */
				expect(control._map).to.not.be.null;
				/* jshint +W030 */
			});

			it('Can be removed', function () {
				map.removeControl(control);
				/* jshint -W030 */
				expect(control._map).to.be.null;
				/* jshint +W030 */
			});
		});


		describe('Location: Latitude/ Longitude', function () {

			it('Can be set', function () {

				control.setLocation(boulderCO);
				/* jshint -W030 */
				expect(Number(control._location.latitude)).to.equal(40);
				expect(Number(control._location.longitude)).to.equal(-105.3);
				/* jshint +W030 */
			});

			it('Can get', function () {
				var location = control.getLocation();
				/* jshint -W030 */
				expect(Number(location.latitude)).to.equal(40);
				expect(Number(location.longitude)).to.equal(-105.3);
				console.log(location);				/* jshint +W030 */
			});

			it('can get static METHOD value', function () {
				expect(CoordinateControl.METHOD).to.equal(control._location.method);
			});

			it('suppresses notifications with silent option', function () {
				
				var onSetLocation = sinon.spy();

				control.on('location', onSetLocation);
				control.setLocation({}, {silent: true});

				expect(onSetLocation.callCount).to.equal(0);
			});
		});


		describe('Submit button click', function () {

			it('Updates the location', function () {

				// submit button on form, submits lat/lon values
				var button = control._submit;

				map.addControl(control);

				control._latitude.value = 55;
				control._longitude.value = 44;

				button.dispatchEvent(getClickEvent());

				var location = control.getLocation();
				/* jshint -W030 */
				expect(Number(location.latitude)).to.equal(55);
				expect(Number(location.longitude)).to.equal(44);
				/* jshint +W030 */
			});

		});


	});

});
