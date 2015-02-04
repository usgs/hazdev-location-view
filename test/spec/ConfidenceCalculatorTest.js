/* global describe, it */
'use strict';

  var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
      expect = require('chai').expect;

  var GeocodeObjectFull = {
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
    };

  var dateTimeLineBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '-179.99',
      '179.99',
    ]
  };

  var LowConfidenceBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '0',
      '1'
    ]
  };

  var BelowAverageConfidenceBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '0',
      '0.5'
    ]
  };

  var AverageConfidenceBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '0',
      '0.05'
    ]
  };

  var AboveAverageConfidenceBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '0',
      '0.005'
    ]
  };

  var HighConfidenceBoundingBox = {
    'boundingbox': [
      '50',
      '50',
      '0',
      '0.0005'
    ]
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
      it('Zoom > 12', function () {
        expect(ConfidenceCalculator.computeFromPoint(13)
          ).to.equal(ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
      });
      it('Zoom > 8', function () {
        expect(ConfidenceCalculator.computeFromPoint(9)
          ).to.equal(ConfidenceCalculator.AVERAGE_CONFIDENCE);
      });
      it('Zoom > 4', function () {
        expect(ConfidenceCalculator.computeFromPoint(5)
          ).to.equal(ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
      });
      it('Zoom <= 4', function () {
        expect(ConfidenceCalculator.computeFromPoint(1)
          ).to.equal(ConfidenceCalculator.LOW_CONFIDENCE);
      });
    });

    describe('computeFromGeocode', function () {
      it('Low Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            LowConfidenceBoundingBox)).to.equal(
            ConfidenceCalculator.LOW_CONFIDENCE);
      });
      it('Below Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            BelowAverageConfidenceBoundingBox)).to.equal(
            ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
      });
      it('Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            AverageConfidenceBoundingBox)).to.equal(
            ConfidenceCalculator.AVERAGE_CONFIDENCE);
      });
      it('Above Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            AboveAverageConfidenceBoundingBox)).to.equal(
            ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
      });
      it('High Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            HighConfidenceBoundingBox)).to.equal(
            ConfidenceCalculator.HIGH_CONFIDENCE);
      });
      it('Crossing Date/Time Line', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            dateTimeLineBoundingBox)).to.equal(
            ConfidenceCalculator.AVERAGE_CONFIDENCE);
      });
      it('Mapquest Example', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
          GeocodeObjectFull)).to.equal(
          ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
      });
    });

    describe('computeZoomFromGeocode', function () {
      it('High Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            HighConfidenceBoundingBox)).to.equal(
            16);
      });
      it('Above Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            AboveAverageConfidenceBoundingBox)).to.equal(
            13);
      });
      it('Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            AverageConfidenceBoundingBox)).to.equal(
            9);
      });
      it('Below Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            BelowAverageConfidenceBoundingBox)).to.equal(
            5);
      });
      it('Low Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            LowConfidenceBoundingBox)).to.equal(
            1);
      });
      it('Crosses Date/Time Line (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            dateTimeLineBoundingBox)).to.equal(
            9);
      });
      it('Mapquest Example', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            GeocodeObjectFull)).to.equal(
            13);
      });
    });

    describe('computeFromGeolocate', function () {
      it('100001 meters', function () {
        expect(ConfidenceCalculator.computeFromGeolocate(100001)).to.equal(
          ConfidenceCalculator.LOW_CONFIDENCE);
      });
      it('10001 meters', function () {
        expect(ConfidenceCalculator.computeFromGeolocate(10001)).to.equal(
          ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
      });
      it('1001 meters', function () {
        expect(ConfidenceCalculator.computeFromGeolocate(1001)).to.equal(
          ConfidenceCalculator.AVERAGE_CONFIDENCE);
      });
      it('101 meters', function () {
        expect(ConfidenceCalculator.computeFromGeolocate(101)).to.equal(
          ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE );
      });
      it('11 meters', function () {
        expect(ConfidenceCalculator.computeFromGeolocate(11)).to.equal(
          ConfidenceCalculator.HIGH_CONFIDENCE);
      });
    });
  });