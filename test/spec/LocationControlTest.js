/* global define, describe, it */
define([
	'chai',
	'LocationControl'
], function (
	chai,
	LocationControl
) {
	'use strict';
	var expect = chai.expect;

	describe('LocationControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(LocationControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

	});

});
