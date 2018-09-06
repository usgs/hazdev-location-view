import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoordinatesService } from './coordinates.service';
import { GeocodeService } from './geocode.service';

describe('GeocodeService', () => {
  let httpClient: HttpTestingController,
      injector: TestBed,
      geocodeService: GeocodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoordinatesService,
        GeocodeService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    injector = getTestBed();
    geocodeService = injector.get(GeocodeService);
    httpClient = injector.get(HttpTestingController);
  });


  afterEach(() => {
    httpClient.verify();
  });

  it('should be created', inject([GeocodeService], (service: GeocodeService) => {
    expect(service).toBeTruthy();
  }));

  describe('buildUrl', () => {
    it('returns correct url', () => {
      let address,
          url;

      address = 'golden colorado';
      url = 'https://geocode.arcgis.com/arcgis/rest/services/' +
          'World/GeocodeServer/find?f=json&text=golden colorado';

      expect(geocodeService.buildUrl(address)).toEqual(url);
    });
  });

  describe('checkLocation', () => {
    it('throws error if no address is given and sets location to null', () => {
      geocodeService.checkLocation('');

      expect(geocodeService.error$).not.toBe(null);
    });
  });

  describe('empty', () => {
    it('notifies with null', () => {
      const spy = jasmine.createSpy('subscriber spy');
      const location = geocodeService.location$;
      const error = geocodeService.error$;

      location.subscribe(spy);
      error.subscribe(spy);

      geocodeService.empty();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('getLocation', () => {
    it('calls http get', () => {
      let locationJSON,
          request;

      locationJSON = {
        locations: [
          {
            name: 'Golden, Colorado'
          }
        ]
      };

      geocodeService.getLocation('Golden, Colorado');

      request = httpClient.expectOne(geocodeService.API_URL +
          '?f=json&text=Golden, Colorado');

      expect(request.request.method).toBe('GET');
      request.flush(locationJSON);

      geocodeService.location$.subscribe((result) => {
        expect(result.name).toEqual(locationJSON.locations[0].name);
      });
    });

    it('calls checkLocation', () => {
      let checkLocationSpy,
          request;

      checkLocationSpy = spyOn(geocodeService, 'checkLocation');
      geocodeService.getLocation('Golden, Colorado');

      request = httpClient.expectOne(geocodeService.API_URL +
          '?f=json&text=Golden, Colorado');


      expect(checkLocationSpy).toHaveBeenCalledWith('Golden, Colorado');
    });

    it('handles error', () => {
      geocodeService.getLocation('Golden, Colorado');

      const request = httpClient.expectOne(geocodeService.API_URL +
          '?f=json&text=Golden, Colorado');

      request.error(new ErrorEvent('You may safely ignore this error.'));

      geocodeService.location$.subscribe((result) => {
        expect(result).toBeNull();
      });
    });
  });

  describe('handleError', () => {
    it('handles errors', () => {
      geocodeService.handleError('^&*', null);

      expect(geocodeService.error$).not.toBe(null);
    });
  });
});
