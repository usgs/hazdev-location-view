/* global define, describe, it */
define([
	'chai',
	'ConfidenceCalculator'
], function (
	chai,
	ConfidenceCalculator
) {
	'use strict';
	var expect = chai.expect;

	describe('ConfidenceCalculator test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(ConfidenceCalculator).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('computeFromCoordinates', function () {
			it('Latitude 39.755543 Longitude -105.2210997 returns HIGH_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.755543',
					'-105.2210997')
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Latitude 39.7554 Longitude -105.2210 return ABOVE_AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7554',
					'-105.2210')
					).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.7554 Longitude -105.221 returns AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7554',
					'-105.221')
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.75 Longitude -105.22 returns BELOW_AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.75',
					'-105.22')
					).to.equal(ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.7 Longitude -105.2 returns LOW_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7',
					'-105.2')
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
			it('Latitude 39.7555 Longitude -105.2210 as numbers returns NOT_COMPUTED',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					39.755543,
					-105.2210997)
					).to.equal(ConfidenceCalculator.NOT_COMPUTED);
			});
		});
		describe('computeFromPoint', function () {
			it('Zoom > 16', function () {
				expect(ConfidenceCalculator.computeFromPoint(17)
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Zoom > 14', function () {
				expect(ConfidenceCalculator.computeFromPoint(15)
					).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
			});
			it('Zoom > 12', function () {
				expect(ConfidenceCalculator.computeFromPoint(13)
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Zoom > 9', function () {
				expect(ConfidenceCalculator.computeFromPoint(10)
					).to.equal(ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
			});
			it('Zoom <= 9', function () {
				expect(ConfidenceCalculator.computeFromPoint(9)
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
		});
		describe('computeFromGeocode', function () {
			it('house', function () {
				expect(ConfidenceCalculator.computeFromGeocode('house')
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Not House', function () {
				expect(ConfidenceCalculator.computeFromGeocode('Not House')
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
		});

	});

});
