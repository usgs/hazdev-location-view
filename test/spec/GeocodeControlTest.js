/* global define, describe, it */
define([
	'chai',
	'GeocodeControl'
], function (
	chai,
	GeocodeControl
) {
	'use strict';
	var expect = chai.expect;

	describe('GeocodeControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(GeocodeControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

	});

});
