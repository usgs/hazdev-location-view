/* global define, describe, it */
define([
	'chai',
	'PointControl'
], function (
	chai,
	PointControl
) {
	'use strict';
	var expect = chai.expect;

	describe('PointControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(PointControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

	});

});
