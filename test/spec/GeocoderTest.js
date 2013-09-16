/* global define, describe, it */
define([
	'chai',
	'Geocoder'
], function (
	chai,
	Geocoder
) {
	'use strict';
	var expect = chai.expect;

	describe('Geocoder test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(Geocoder).to.not.be.null;
				/* jshint +W030 */
			});
		});

	});

});
