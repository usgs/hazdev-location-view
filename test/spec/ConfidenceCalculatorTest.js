/* global chai, describe, it */
'use strict';

  var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
      expect = chai.expect;

  var GeocodeObjectFull = {
    'name': 'Denver, Colorado, United States',
    'extent': {
      'xmin': -105.1867,
      'ymin': 39.537146999999997,
      'xmax': -104.78270000000001,
      'ymax': 39.941147000000001
    },
    'feature': {
      'geometry': {
        'x': -104.98469944299967,
        'y': 39.739147434000472
      },
      'attributes': {
        'Score': 100,
        'Addr_Type': 'POI'
      }
    }
  };

  var NoConfidenceInput = {
    'extent': {
      'xmax': 20,
      'xmin': 10,
      'ymax': 20,
      'ymin': 10
    }
  };

  var LowConfidenceInput = {
    'extent': {
      'xmax': 20,
      'xmin': 11,
      'ymax': 20,
      'ymin': 11
    }
  };

  var BelowAverageConfidenceInput = {
    'extent': {
      'xmax': 2,
      'xmin': 1.1,
      'ymax': 2,
      'ymin': 1.1
    }
  };

  var AverageConfidenceInput = {
    'extent': {
      'xmax': 0.2,
      'xmin': 0.11,
      'ymax': 0.2,
      'ymin': 0.11
    }
  };

  var AboveAverageConfidenceInput = {
    'extent': {
      'xmax': 0.02,
      'xmin': 0.011,
      'ymax': 0.02,
      'ymin': 0.011
    }
  };

  var HighConfidenceInput = {
    'extent': {
      'xmax': 0.002,
      'xmin': 0.0011,
      'ymax': 0.002,
      'ymin': 0.0011
    }
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
      it('No Confidence', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
            NoConfidenceInput)).to.equal(
            ConfidenceCalculator.NO_CONFIDENCE);
      });
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
      it('ESRI Example', function () {
        expect(ConfidenceCalculator.computeFromGeocode(
          GeocodeObjectFull)).to.equal(
          ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE);
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
      it('No Confidence (bounding box)', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            NoConfidenceInput)).to.equal(
            1);
      });
      it('ESRI Example', function () {
        expect(ConfidenceCalculator.computeZoomFromGeocode(
            GeocodeObjectFull)).to.equal(
            5);
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
