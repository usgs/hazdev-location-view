/* global define, describe, it */
define([
	'chai',
	'LocationControl',
	'leaflet'
], function (
	chai,
	LocationControl,
	L
) {
	'use strict';
	var expect = chai.expect,
	    map = new L.Map(L.DomUtil.create('div', 'map'), {
				center: new L.LatLng(40.0, -105.0),
				zoom: 3
			}),
	    lc = new LocationControl({
				includePointControl: true,
				includeCoordinateControl: true,
				includeGeocodeControl: true
			}),
	    loc = {
				accuracy: null,
				confidence: 'FooConfidence',
				latitude: 47.754097979680026,
				longitude: -117.94921874999999,
				method: 'PointControl',
				place: '47.75&deg;N, 117.95&deg;W',
				type: 'location',
			};

	map.addControl(lc);

	describe('LocationControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(LocationControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('Add Controls', function () {

			var controls = map._controlCorners.topleft;

			it('Can add the PointControl', function () {
				var pointControl = controls.querySelector('.leaflet-point-control');
				/* jshint -W030 */
				expect(pointControl).to.not.be.null;
				/* jshint +W030 */
			});

			it('Can add the CoordinateControl', function () {
				var coordinateControl = controls.querySelector(
						'.leaflet-coordinate-control-wrapper');
				/* jshint -W030 */
				expect(coordinateControl).to.not.be.null;
				/* jshint +W030 */
			});

			it.skip('Can add the GeocodeControl', function () {
				var geocodeControl = controls.querySelector(
						'.leaflet-geocode-control');
				/* jshint -W030 */
				expect(geocodeControl).to.not.be.null;
				/* jshint +W030 */
			});

			it.skip('Can add the GeolocateControl', function () {
				var geolocateControl = controls.querySelector(
						'.leaflet-geolocate-control');
				/* jshint -W030 */
				expect(geolocateControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('Bind to PointControl location Change', function () {
			it('Can update CoordinateControl on PointControl change', function () {
				lc.PointControl.setLocation(loc);
				// Check if coordinate control was updated with location.
				expect(lc.getLocation().latitude).to.equal(loc.latitude);
				expect(lc.getLocation().longitude).to.equal(loc.longitude);
			});
		});

		describe('Bind to CoordinateControl location Change', function () {
			it('Can update PointControl on CoordinateControl change', function () {
				lc.CoordinateControl.setLocation(loc);
				// Check if coordinate control was updated with location.
				expect(lc.getLocation().latitude).to.equal(loc.latitude);
				expect(lc.getLocation().longitude).to.equal(loc.longitude);
			});
		});

		describe('Bind to GeocodeControl location Change', function () {
			it('Can update PointControl on GeocodeControl change', function () {
				lc.GeocodeControl.setLocation(loc);
				// Check if coordinate control was updated with location.
				expect(lc.getLocation().latitude).to.equal(loc.latitude);
				expect(lc.getLocation().longitude).to.equal(loc.longitude);
			});
		});

	});

});
