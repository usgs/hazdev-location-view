/* global chai, describe, it */
'use strict';

  var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
      expect = chai.expect;

  var GeocodeObjectFull = {
    'street': 'County Road 34',
    'adminArea6': '',
    'adminArea6Type': 'Neighborhood',
    'adminArea5': '',
    'adminArea5Type': 'City',
    'adminArea4': 'Elbert County',
    'adminArea4Type': 'County',
    'adminArea3': 'CO',
    'adminArea3Type': 'State',
    'adminArea1': 'US',
    'adminArea1Type': 'Country',
    'postalCode': '80832',
    'geocodeQualityCode': 'B1AAA',
    'geocodeQuality': 'STREET',
    'dragPoint': false,
    'sideOfStreet': 'N',
    'linkId': '0',
    'unknownInput': '',
    'type': 's',
    'latLng': {
      'lat': 38.984439,
      'lng': -104.015478
    },
    'displayLatLng': {
      'lat': 38.984439,
      'lng': -104.015478
    },
    'mapUrl': 'http://open.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd|luub2h0rnh,b2=o5-9ut0g6&type=map&size=225,160&pois=purple-1,38.984439,-104.0154779,0,0,|&center=38.984439,-104.0154779&zoom=15&rand=-672210244'
  };

  var LowConfidenceInput = {
    geocodeQualityCode: 'A3XXX'
  };

  var BelowAverageConfidenceInput = {
    geocodeQualityCode: 'A4XXX'
  };

  var AverageConfidenceInput = {
    geocodeQualityCode: 'A5XXX'
  };

  var AboveAverageConfidenceInput = {
    geocodeQualityCode: 'A6XXX'
  };

  var HighConfidenceInput = {
    geocodeQualityCode: 'P1XXX'
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
            LowConfidenceInput)).to.equal(
            ConfidenceCalculator.LOW_CONFIDENCE);
      });
      it('Below Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            BelowAverageConfidenceInput)).to.equal(
            ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
      });
      it('Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            AverageConfidenceInput)).to.equal(
            ConfidenceCalculator.AVERAGE_CONFIDENCE);
      });
      it('Above Average Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            AboveAverageConfidenceInput)).to.equal(
            ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE);
      });
      it('High Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            HighConfidenceInput)).to.equal(
            ConfidenceCalculator.HIGH_CONFIDENCE);
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
            HighConfidenceInput)).to.equal(
            16);
      });
      it('Above Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            AboveAverageConfidenceInput)).to.equal(
            13);
      });
      it('Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            AverageConfidenceInput)).to.equal(
            9);
      });
      it('Below Average Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            BelowAverageConfidenceInput)).to.equal(
            5);
      });
      it('Low Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            LowConfidenceInput)).to.equal(
            1);
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
