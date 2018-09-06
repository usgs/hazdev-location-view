import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CoordinatesService } from './coordinates.service';

describe('CoordinatesService', () => {
  let injector: TestBed,
      coordinatesService;

  const GeocodeObjectFull = {
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

  const CoordinateObject = {
    confidence: 1,
    latitude: 35,
    longitude: -105,
    method: 'point',
    name: '',
    zoom: 16
  };

  const NoConfidenceInput = {
    'extent': {
      'xmax': 20,
      'xmin': 10,
      'ymax': 20,
      'ymin': 10
    }
  };

  const LowConfidenceInput = {
    'extent': {
      'xmax': 20,
      'xmin': 11,
      'ymax': 20,
      'ymin': 11
    }
  };

  const BelowAverageConfidenceInput = {
    'extent': {
      'xmax': 2,
      'xmin': 1.1,
      'ymax': 2,
      'ymin': 1.1
    }
  };

  const AverageConfidenceInput = {
    'extent': {
      'xmax': 0.2,
      'xmin': 0.11,
      'ymax': 0.2,
      'ymin': 0.11
    }
  };

  const AboveAverageConfidenceInput = {
    'extent': {
      'xmax': 0.02,
      'xmin': 0.011,
      'ymax': 0.02,
      'ymin': 0.011
    }
  };

  const HighConfidenceInput = {
    'extent': {
      'xmax': 0.002,
      'xmin': 0.0011,
      'ymax': 0.002,
      'ymin': 0.0011
    }
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        CoordinatesService
      ]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    coordinatesService = injector.get(CoordinatesService);
  });

  it('should be created', () => {
    expect(coordinatesService).toBeTruthy();
  });

  describe('computeFromCoordinates', () => {
    it('Latitude 39.755543 Longitude -105.2210997 returns HIGH_CONFIDENCE',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.755543',
        '-105.2210997')
        ).toEqual(coordinatesService.HIGH_CONFIDENCE);
    });
    it('Latitude 39.7554 Longitude -105.2210 return ABOVE_AVERAGE_CONFIDENCE',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.7554',
        '-105.2210')
        ).toEqual(coordinatesService.ABOVE_AVERAGE_CONFIDENCE);
    });
    it('Latitude 39.7554 Longitude -105.221 returns AVERAGE_CONFIDENCE',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.7554',
        '-105.221')
        ).toEqual(coordinatesService.AVERAGE_CONFIDENCE);
    });
    it('Latitude 39.75 Longitude -105.22 returns BELOW_AVERAGE_CONFIDENCE',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.75',
        '-105.22')
        ).toEqual(coordinatesService.BELOW_AVERAGE_CONFIDENCE);
    });
    it('Latitude 39.7 Longitude -105.2 returns LOW_CONFIDENCE',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.7',
        '-105.2')
        ).toEqual(coordinatesService.LOW_CONFIDENCE);
    });
    it('Latitude 39.7555 Longitude -105.2210 as numbers returns NOT_COMPUTED',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        39.755543,
        -105.2210997)
        ).toEqual(coordinatesService.NOT_COMPUTED);
    });
    it('Latitude 39.7555 Longitude -105.2210 mixed returns NOT_COMPUTED',
      function () {
      expect(coordinatesService.computeFromCoordinates(
        '39.755543',
        -105.2210997)
        ).toEqual(coordinatesService.NOT_COMPUTED);
    });
  });

  describe('computeFromGeocode', () => {
    it('No Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          NoConfidenceInput)).toEqual(
          coordinatesService.NO_CONFIDENCE);
    });
    it('Low Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          LowConfidenceInput)).toEqual(
          coordinatesService.LOW_CONFIDENCE);
    });
    it('Below Average Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          BelowAverageConfidenceInput)).toEqual(
          coordinatesService.BELOW_AVERAGE_CONFIDENCE);
    });
    it('Average Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          AverageConfidenceInput)).toEqual(
          coordinatesService.AVERAGE_CONFIDENCE);
    });
    it('Above Average Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          AboveAverageConfidenceInput)).toEqual(
          coordinatesService.ABOVE_AVERAGE_CONFIDENCE);
    });
    it('High Confidence', function () {
      expect(coordinatesService.computeFromGeocode(
          HighConfidenceInput)).toEqual(
          coordinatesService.HIGH_CONFIDENCE);
    });
    it('ESRI Example', function () {
      expect(coordinatesService.computeFromGeocode(
          GeocodeObjectFull)).toEqual(
          coordinatesService.BELOW_AVERAGE_CONFIDENCE);
    });
  });

  describe('computeFromGeolocate', () => {
    it('100001 meters', function () {
      expect(coordinatesService.computeFromGeolocate(100001)).toEqual(
        coordinatesService.LOW_CONFIDENCE);
    });
    it('10001 meters', function () {
      expect(coordinatesService.computeFromGeolocate(10001)).toEqual(
        coordinatesService.BELOW_AVERAGE_CONFIDENCE);
    });
    it('1001 meters', function () {
      expect(coordinatesService.computeFromGeolocate(1001)).toEqual(
        coordinatesService.AVERAGE_CONFIDENCE);
    });
    it('101 meters', function () {
      expect(coordinatesService.computeFromGeolocate(101)).toEqual(
        coordinatesService.ABOVE_AVERAGE_CONFIDENCE );
    });
    it('11 meters', function () {
      expect(coordinatesService.computeFromGeolocate(11)).toEqual(
        coordinatesService.HIGH_CONFIDENCE);
    });
  });

  describe('computeFromPoint', () => {
    it('Zoom > 16', function () {
      expect(coordinatesService.computeFromPoint(17)
        ).toEqual(coordinatesService.HIGH_CONFIDENCE);
    });
    it('Zoom > 12', function () {
      expect(coordinatesService.computeFromPoint(13)
        ).toEqual(coordinatesService.ABOVE_AVERAGE_CONFIDENCE);
    });
    it('Zoom > 8', function () {
      expect(coordinatesService.computeFromPoint(9)
        ).toEqual(coordinatesService.AVERAGE_CONFIDENCE);
    });
    it('Zoom > 4', function () {
      expect(coordinatesService.computeFromPoint(5)
        ).toEqual(coordinatesService.BELOW_AVERAGE_CONFIDENCE);
    });
    it('Zoom <= 4', function () {
      expect(coordinatesService.computeFromPoint(1)
        ).toEqual(coordinatesService.LOW_CONFIDENCE);
    });
  });

  describe('computeZoomFromConfidence', () => {
    it('High Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.HIGH_CONFIDENCE)).toEqual(
          16);
    });
    it('Above Average Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.ABOVE_AVERAGE_CONFIDENCE)).toEqual(
          13);
    });
    it('Average Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.AVERAGE_CONFIDENCE)).toEqual(
          9);
    });
    it('Below Average Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.BELOW_AVERAGE_CONFIDENCE)).toEqual(
          5);
    });
    it('Low Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.LOW_CONFIDENCE)).toEqual(
          1);
    });
    it('No Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.NO_CONFIDENCE)).toEqual(
          1);
    });
    it('Not Computed Confidence', function () {
      expect(coordinatesService.computeZoomFromConfidence(
          coordinatesService.NO_CONFIDENCE)).toEqual(
          1);
    });
  });

  describe('roundLocation', () => {
    it('High Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.HIGH_CONFIDENCE)).toEqual(
          1.22222);
    });
    it('Above Average Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.ABOVE_AVERAGE_CONFIDENCE)).toEqual(
          1.2222);
    });
    it('Average Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.AVERAGE_CONFIDENCE)).toEqual(
          1.222);
    });
    it('Below Average Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.BELOW_AVERAGE_CONFIDENCE)).toEqual(
          1.22);
    });
    it('Low Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.LOW_CONFIDENCE)).toEqual(
          1.2);
    });
    it('No Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.NO_CONFIDENCE)).toEqual(
          1);
    });
    it('Not Computed Confidence', function () {
      expect(coordinatesService.roundLocation(1.22222222,
          coordinatesService.NO_CONFIDENCE)).toEqual(
          1);
    });
  });

  describe('setCoordinates', () => {
    it('sets value on observable', () => {
      const location = {
        confidence: null,
        latitude: 1,
        longitude: 1,
        zoom: null,
        method: null,
        name: null
      };
      const spy = jasmine.createSpy('subscriber spy');
      const coordinates = coordinatesService.coordinates$;

      coordinates.subscribe(spy);
      coordinatesService.setCoordinates(location);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(location);
    });
  });

});
