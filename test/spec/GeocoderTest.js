/* global define, describe, it */
define([
	'chai',
	'sinon',
	'Geocoder'
], function (
	chai,
	sinon,
	Geocoder
) {
	'use strict';
	var expect = chai.expect;
	var geocoder = new Geocoder({apiKey: 'foobar'});

	describe('Geocoder test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(Geocoder).to.not.be.null;
				expect(geocoder).to.be.an.instanceOf(Geocoder);
				/* jshint +W030 */
			});
		});

		describe('forward', function () {

			it('should call the success callback', function () {
				var stub = null, successSpy = sinon.spy(), errorSpy = sinon.spy();

				stub = sinon.stub(geocoder, '_submitRequest',
				function (params, url, successCallback) {
					successCallback({});
				});


				geocoder.forward('Lancaster County', successSpy, errorSpy);

				expect(successSpy.callCount).to.equal(1);
				expect(errorSpy.callCount).to.equal(0);
				stub.restore();
			});

			it('should call the error callback', function () {
				var stub = null, successSpy = sinon.spy(), errorSpy = sinon.spy();

				stub = sinon.stub(geocoder, '_submitRequest',
				function (params, url, successCallback, errorCallback) {
					errorCallback({});
				});

				geocoder.forward('Lancaster County', successSpy, errorSpy);

				expect(successSpy.callCount).to.equal(0);
				expect(errorSpy.callCount).to.equal(1);
				stub.restore();
			});

			it('is called with an address', function () {
				var stub = null, args = null,
				    successSpy = sinon.spy(), errorSpy = sinon.spy();

				stub = sinon.stub(geocoder, '_submitRequest');

				geocoder.forward('Lancaster County', successSpy, errorSpy);
				expect(stub.callCount).to.equal(1);

				args = stub.getCall(0).args;
				expect(args[0]).to.deep.equal({location: 'Lancaster County'});
				stub.restore();
			});

		});

		describe('reverse', function () {

			it('should call the success callback', function () {
				var stub = null, successSpy = sinon.spy(), errorSpy = sinon.spy();

				stub = sinon.stub(geocoder, '_submitRequest',
				function (params, url, successCallback) {
					successCallback({});
				});

				geocoder.reverse(40.0755, -76.329999, successSpy, errorSpy);

				expect(successSpy.callCount).to.equal(1);
				expect(errorSpy.callCount).to.equal(0);
				stub.restore();
			});

			it('should call the error callback', function () {
				var stub = null, successSpy = sinon.spy(), errorSpy = sinon.spy();

					stub = sinon.stub(geocoder, '_submitRequest',
					function (params, url, successCallback, errorCallback) {
						errorCallback({});
					});

					geocoder.reverse(40.0755, -76.329999, successSpy, errorSpy);

					expect(successSpy.callCount).to.equal(0);
					expect(errorSpy.callCount).to.equal(1);
					stub.restore();
			});

			it('is called with a coordinate', function () {
				var stub = null, args = null,
				    successSpy = sinon.spy(), errorSpy = sinon.spy();

				stub = sinon.stub(geocoder, '_submitRequest');

				geocoder.reverse(40.0755, -76.329999, successSpy, errorSpy);
				expect(stub.callCount).to.equal(1);

				args = stub.getCall(0).args;
				expect(args[0]).to.deep.equal({lat: 40.0755, lng: -76.329999});
			});

		});

	});

});
