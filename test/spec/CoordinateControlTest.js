/* global define, describe, it */
define([
	'chai',
	'CoordinateControl'
], function (
	chai,
	CoordinateControl
) {
	'use strict';
	var expect = chai.expect;

	describe('CoordinateControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(CoordinateControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

	});

});
