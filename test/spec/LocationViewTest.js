define([
	'chai',
	'LocationView'
], function (
	chai,
	LocationView
) {
	var expect = chai.expect;

	describe('LocationView test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				expect(LocationView).to.not.be.null;
			});
		});

	});

});
