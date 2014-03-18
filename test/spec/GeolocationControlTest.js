/* global define, describe, it */
define([
	'chai',
	'sinon',
	'leaflet',

	'GeolocationControl'
], function (
	chai,
	sinon,
	L,

	GeolocationControl
) {
	'use strict';
	var expect = chai.expect;


	describe('GeolocationControl test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(GeolocationControl).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('initialize()', function () {
			var glc = new GeolocationControl();

			it('Can be instantiated', function () {
				expect(glc).to.be.an.instanceof(GeolocationControl);
			});

			it('Inherits from L.Control', function () {
				expect(glc).to.be.an.instanceof(L.Control);
			});

			it('sets options on itself', function () {
				expect(glc.options).to.be.an.instanceof(Object);
			});

		});

		describe('onAdd()', function () {
			var glc = new GeolocationControl({'geolocation':
				{
					getCurrentPosition: function (success /*,error */) {
						success({
							coords:{
								longitude: 45,
								latitude: -105,
								accuracy: 10
							}
						});
					}
				}
			});
			var clickHandler = sinon.spy(glc, 'doGeolocate');

			var c = glc.onAdd(L.map(document.createElement('div')));

			var getClickEvent = function () {
				var clickEvent = document.createEvent('MouseEvents');
				clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
				return clickEvent;
			};

			it('register a click handler in onAdd method', function () {
				expect(clickHandler.callCount).to.equal(0);

				c.dispatchEvent(getClickEvent());
				expect(clickHandler.callCount).to.equal(1);

			});

			it('has a map after adding', function () {
				expect(glc._map).to.be.an.instanceof(L.Map);
			});
		});

	});

});
