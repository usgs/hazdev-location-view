/* global define, describe, it */
define([
	'chai',
	'GeocodeControl',
	'leaflet',
	'sinon'
], function (
	chai,
	GeocodeControl,
	L
	//sinon
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

		describe('initialize()', function () {
			var G = new GeocodeControl();
			
			it('Can be instantiated', function () {
				expect(G).to.be.an.instanceof(GeocodeControl);
			});

			it('Inherits from L.Control', function () {
				expect(G).to.be.an.instanceof(L.Control);
			});

			it('sets options on itself', function () {
				expect(G.options).to.be.an.instanceof(Object);
			});

		});


		describe('setLocation()', function () {
			it('sets its location', function () {
				var loc = {};
				var G = new GeocodeControl();
				G.setLocation(loc);
				expect(G._loc).to.equal(loc);
			});
		});

		describe('getLocation()', function() {
			it('can get its location', function () {
				var loc = {};
				var G = new GeocodeControl();
				G._loc = loc;
				expect(G.getLocation()).to.equal(loc);
			});
		});

		describe('onAdd()', function () {
			var G = new GeocodeControl();

			it('Check for map', function () {
				/* jshint -W030 */
				expect(G._map).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('doGeocode', function (){

		});

		describe('onKeyUp', function (){
			
		});
	});

});
