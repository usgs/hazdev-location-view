/* global define, describe, it, before, after */
define([
	'chai',
	'sinon',

	'GeolocationClass',
	'ConfidenceCalculator'
], function (
	chai,
	sinon,

	GeolocationClass,
	ConfidenceCalculator
) {
	'use strict';
	var expect = chai.expect;
	

	describe('GeolocationClass test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(GeolocationClass).to.not.be.null;
				/* jshint +W030 */
			});
		});
		describe('Class Unit Tests', function () {
			var geolocate = new GeolocationClass(),
			    stub;
			var location = {
				'place': null,
				'longitude': -105,
				'latitude': 40,
				'confidence':ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE,
				'accuracy': null
			};
			before(function () {
				stub = sinon.stub(GeolocationClass.prototype, 'getGeolocation',
					function (options){
						options.success(location);
					});
			});
			after(function () {
				stub.restore();
			});

			it('Can be instantiated', function () {
				expect(geolocate).to.be.an.instanceOf(GeolocationClass);
				expect(geolocate._options.location.latitude).to.equal(null);
			});
			it('Supports geolocate', function () {
				expect(geolocate.supportsGeolocate()).to.not.equal(false);
			});
			it('returns a location value', function () {
				geolocate.getGeolocation({success: function (location) {
					expect(location.longitude).to.equal(-105);
					expect(location.latitude).to.equal(40);
					expect(location.confidence).to.equal(
							ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
				}});
			});
		});

	});

});
