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

	});

});
