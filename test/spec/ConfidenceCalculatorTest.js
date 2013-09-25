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

/*	var GeocodeObjectFullOld = {
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
	};*/

	var GeocodeObjectFull = [{
		'place_id': '36099528',
		'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright',
		'osm_type': 'way',
		'osm_id': '23580556',
		'boundingbox': [
			'51.4828405',
			'51.4847466',
			'-0.6083938',
			'-0.5999973'
		],
		'lat': '51.48379355',
		'lon': '-0.60416529240868',
		'display_name': 'Windsor Castle, Moat Path, Clewer New Town, Eton, Windsor and Maidenhead, South East England, England, SL4 1PB, United Kingdom, European Union',
		'class': 'historic',
		'type': 'castle',
		'importance': 0.60105687743994,
		'icon': 'http://open.mapquestapi.com/nominatim/v1/images/mapicons/tourist_castle.p.20.png',
		'address': {
			'castle': 'Windsor Castle',
			'path': 'Moat Path',
			'suburb': 'Clewer New Town',
			'town': 'Eton',
			'county': 'Windsor and Maidenhead',
			'state_district': 'South East England',
			'state': 'England',
			'postcode': 'SL4 1PB',
			'country': 'United Kingdom',
			'country_code': 'gb',
			'continent': 'European Union'
			}
		}];

	var GeocodeObjectHouse = [{'type':'house'}];
	var GeocodeObjectCity = [{'type':'city'}];
	var GeocodeObjectAdministrative = [{'type':'administrative'}];
	var GeocodeObjectPostCode = [{'type':'postcode'}];


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
				expect(ConfidenceCalculator.computeFromGeocode(
						GeocodeObjectFull)).to.equal(
						ConfidenceCalculator.NOT_COMPUTED);
			});
			it('house (High Confidence)', function () {
				expect(ConfidenceCalculator.computeFromGeocode(
						GeocodeObjectHouse)).to.equal(
						ConfidenceCalculator.HIGH_CONFIDENCE);
			});
			it('city (Average Confidence)', function () {
				expect(ConfidenceCalculator.computeFromGeocode(
						GeocodeObjectCity)).to.equal(
						ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('postcode (Average Confidence)', function () {
				expect(ConfidenceCalculator.computeFromGeocode(
						GeocodeObjectPostCode)).to.equal(
						ConfidenceCalculator.AVERAGE_CONFIDENCE);
			});
			it('administrative (Low Confidence)', function () {
				expect(ConfidenceCalculator.computeFromGeocode(
						GeocodeObjectAdministrative)).to.equal(
						ConfidenceCalculator.LOW_CONFIDENCE);
			});
		});

		describe('computeZoomFromGeocode', function () {
			it('Mapquest Example', function () {
				expect(ConfidenceCalculator.computeZoomFromGeocode(
						GeocodeObjectFull)).to.equal(
						6);
			});
			it('house (High Confidence)', function () {
				expect(ConfidenceCalculator.computeZoomFromGeocode(
						GeocodeObjectHouse)).to.equal(
						17);
			});
			it('city (Average Confidence)', function () {
				expect(ConfidenceCalculator.computeZoomFromGeocode(
						GeocodeObjectCity)).to.equal(
						13);
			});
			it('postcode (Average Confidence)', function () {
				expect(ConfidenceCalculator.computeZoomFromGeocode(
						GeocodeObjectPostCode)).to.equal(
						13);
			});
			it('administrative (Low Confidence)', function () {
				expect(ConfidenceCalculator.computeZoomFromGeocode(
						GeocodeObjectAdministrative)).to.equal(
						8);
			});
		});

	});

});
