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

	var GeocodeObjectFull = {
	'results':[
	{'locations':
	[
	{'latLng':{'lng':-76.30127,'lat':40.03804},
	'adminArea4':'Lancaster County',
	'adminArea5Type':'City',
	'adminArea4Type':'County',
	'adminArea5':'Lancaster',
	'street':'',
	'adminArea1':'US',
	'adminArea3':'PA',
	'type':'s',
	'displayLatLng':{'lng':-76.30127,'lat':40.03804},
	'linkId':0,
	'postalCode':'',
	'sideOfStreet':'N',
	'dragPoint':false,
	'adminArea1Type':'Country',
	'geocodeQuality':'CITY',
	'geocodeQualityCode':'A5XAX',
	'mapUrl':'http://www.mapquestapi.com/staticmap/v4/getmap?key=Kmjtd|luua2qu7n9,7a=o5-lzbgq&type=map&size=225,160&pois=purple-1,40.03804,-76.30127,0,0|&center=40.03804,-76.30127&zoom=12&rand=-1780045932',
		'adminArea3Type':'State'}],
		'providedLocation':{'location':'Lancaster,PA'}}],
		'options':{'ignoreLatLngInput':false,'maxResults':-1,'thumbMaps':true},
		'info':{
					'copyright':{'text':'© 2013 MapQuest, Inc.',
							'imageUrl':'http://api.mqcdn.com/res/mqlogo.gif',
							'imageAltText':'© 2013 MapQuest, Inc.'},
					'statuscode':0,'messages':[]}
	};

	var GeocodeObjectStreet = {
	'results':[
	{'locations':[{'geocodeQuality':'STREET','geocodeQualityCode':'B2AAA'}]}]
	};

	var GeocodeObjectPoint = {
	'results':[
	{'locations':[{'geocodeQuality':'Point','geocodeQualityCode':'P1AAA'}]}]
	};
	var GeocodeObjectPointPoor = {
	'results':[
	{'locations':[{'geocodeQuality':'Point','geocodeQualityCode':'P1CAA'}]}]
	};
	var GeocodeObjectPointBad = {
	'results':[
	{'locations':[{'geocodeQuality':'Point','geocodeQualityCode':'P1XAA'}]}]
	};
	var GeocodeObjectCityPoor = {
	'results':[
	{'locations':[{'geocodeQuality':'City','geocodeQualityCode':'A5XCX'}]}]
	};


	describe('ConfidenceCalculator test suite', function () {

		describe('Class Definition', function () {
			it('Can be required', function () {
				/* jshint -W030 */
				expect(ConfidenceCalculator).to.not.be.null;
				/* jshint +W030 */
			});
		});

		describe('computeFromCoordinates', function () {
			it('Latitude 39.755543 Longitude -105.2210997 returns HIGH_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.755543',
					'-105.2210997')
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Latitude 39.7554 Longitude -105.2210 return ABOVE_AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7554',
					'-105.2210')
					).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.7554 Longitude -105.221 returns AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7554',
					'-105.221')
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.75 Longitude -105.22 returns BELOW_AVERAGE_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.75',
					'-105.22')
					).to.equal(ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
			});
			it('Latitude 39.7 Longitude -105.2 returns LOW_CONFIDENCE',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.7',
					'-105.2')
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
			it('Latitude 39.7555 Longitude -105.2210 as numbers returns NOT_COMPUTED',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					39.755543,
					-105.2210997)
					).to.equal(ConfidenceCalculator.NOT_COMPUTED);
			});
			it('Latitude 39.7555 Longitude -105.2210 mixed returns NOT_COMPUTED',
				function () {
				expect(ConfidenceCalculator.computeFromCoordinates(
					'39.755543',
					-105.2210997)
					).to.equal(ConfidenceCalculator.NOT_COMPUTED);
			});
		});

		describe('computeFromPoint', function () {
			it('Zoom > 16', function () {
				expect(ConfidenceCalculator.computeFromPoint(17)
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Zoom > 14', function () {
				expect(ConfidenceCalculator.computeFromPoint(15)
					).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
			});
			it('Zoom > 12', function () {
				expect(ConfidenceCalculator.computeFromPoint(13)
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Zoom > 9', function () {
				expect(ConfidenceCalculator.computeFromPoint(10)
					).to.equal(ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
			});
			it('Zoom <= 9', function () {
				expect(ConfidenceCalculator.computeFromPoint(9)
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
		});

		describe('computeFromGeocode', function () {
			it('Mapquest Example', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectFull)
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Street', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectStreet)
					).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
			});
			it('Street', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectPoint)
					).to.equal(ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('Street', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectPointBad)
					).to.equal(ConfidenceCalculator.NOT_COMPUTED);
			});
			it('Street', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectPointPoor)
					).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('Street', function () {
				expect(ConfidenceCalculator.computeFromGeocode(GeocodeObjectCityPoor)
					).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
			});
		});

	});

});
