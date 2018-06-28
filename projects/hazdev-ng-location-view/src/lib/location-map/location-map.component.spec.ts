import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import * as L from 'leaflet';

import { LocationMapComponent } from './location-map.component';

import { Coordinates } from '../coordinates';
import { CoordinatesService } from '../coordinates.service';

describe('LocationMapComponent', () => {
  let component: LocationMapComponent;
  let fixture: ComponentFixture<LocationMapComponent>;
  let coordinatesService;

  const point = 35;

  const coordinates: Coordinates = {
    confidence: 1,
    latitude: point,
    longitude: point,
    method: 'point',
    name: '',
    zoom: 16
  };

  beforeEach(async(() => {
    const coordinatesServiceStub = {
      computeFromPoint: (geocodeLocation: any) => {
        console.log('stubbified!');
      },
      coordinates$: {
        subscribe: () => {
          console.log('stubbified!');
        }
      },
      setCoordinates: (location: any) => {
        console.log('stubbified!');
      },
      roundLocation: (value: number, confidence: number) => {
        console.log('stubbified!');
      }
    };

    const dialogStub = {
      open: () => {
        console.log('stubbified!');
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        LocationMapComponent
      ],
      imports: [
        HttpClientModule,
      ],
      providers: [
        {provide: CoordinatesService, useValue: coordinatesServiceStub},
        {provide: MatDialog, useValue: dialogStub}
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    coordinatesService = fixture.debugElement.injector.get(CoordinatesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addBaselayers', () => {
    it('should add baselayers to the map', () => {
      let mapSpy;

      mapSpy = spyOn(component.map, 'addLayer');

      // call addBaselayers
      component.addBaselayers();

      // check results
      expect(mapSpy).toHaveBeenCalled();
    });
  });

  describe('addLocationControl', () => {
    it('should add the location control to the map', () => {
      let mapSpy;

      mapSpy = spyOn(component.map, 'addControl');

      // call addLocationControl
      component.addLocationControl();

      // check results
      expect(mapSpy).toHaveBeenCalled();
    });
  });


  describe('createMap', () => {
    it('should create a map', () => {
      // check map
      expect(component.map).not.toBeNull();
    });
  });

  describe('createMarker', () => {
    it('should create a marker', () => {
      // check marker
      expect(component.marker).not.toBeNull();
    });
  });

  describe('moveMap', () => {
    it('should center/zoom the map', () => {
      let latLng,
          mapSpy,
          zoom;

      // set lat/lng object and zoom level
      latLng = L.latLng(coordinates.latitude, coordinates.longitude);
      zoom = coordinates.zoom;

      // setup spies
      mapSpy = spyOn(component.map, 'setView');

      // call moveMap
      component.moveMap(coordinates);

      // check results
      expect(mapSpy).toHaveBeenCalled();
      expect(mapSpy).toHaveBeenCalledWith(latLng, zoom);
    });
  });

  describe('moveMarker', () => {
    it('should move the marker on the map', () => {
      let latLng,
          marker,
          mapSpy,
          map2Spy,
          markerSpy;

      // set lat/lng object and marker
      latLng = L.latLng(coordinates.latitude, coordinates.longitude);
      marker = L.marker(latLng);
      component.marker = marker;

      // setup spies
      mapSpy = spyOn(component.map, 'hasLayer');
      map2Spy = spyOn(component.map, 'addLayer');
      markerSpy = spyOn(component.marker, 'setLatLng').and.returnValue(marker);

      // call moveMarker
      component.moveMarker(coordinates);

      // check results
      expect(markerSpy).toHaveBeenCalled();
      expect(markerSpy).toHaveBeenCalledWith(latLng);
      expect(mapSpy).toHaveBeenCalled();
      expect(mapSpy).toHaveBeenCalledWith(marker);
      expect(map2Spy).toHaveBeenCalled();
      expect(map2Spy).toHaveBeenCalledWith(marker);
    });
  });

  describe('onDragEnd', () => {
    it('should update the saved coordinates', () => {
      let confidenceSpy,
          latLng,
          marker,
          mapSpy,
          markerSpy,
          roundLocationSpy,
          setCoordinatesSpy;

      // set lat/lng object and marker
      latLng = L.latLng(coordinates.latitude, coordinates.longitude);
      marker = L.marker(latLng);
      component.marker = marker;

      // setup spies
      confidenceSpy = spyOn(coordinatesService, 'computeFromPoint').and.returnValue(coordinates.confidence);
      markerSpy = spyOn(component.marker, 'getLatLng').and.returnValue(latLng);
      mapSpy = spyOn(component.map, 'getZoom').and.returnValue(coordinates.zoom);
      setCoordinatesSpy = spyOn(coordinatesService, 'setCoordinates');
      roundLocationSpy = spyOn(coordinatesService, 'roundLocation').and.returnValue(point);

      // call onDragEnd
      component.onDragEnd();

      // check results
      expect(markerSpy).toHaveBeenCalled();
      expect(mapSpy).toHaveBeenCalled();
      expect(confidenceSpy).toHaveBeenCalled();
      expect(confidenceSpy).toHaveBeenCalledWith(coordinates.zoom);
      expect(setCoordinatesSpy).toHaveBeenCalled();
      expect(setCoordinatesSpy).toHaveBeenCalledWith({
        confidence: coordinates.confidence,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        method: coordinates.method,
        zoom: coordinates.zoom
      });
    });
  });

  describe('subscribeToServices', () => {
    it('should subscribe to the coordinates service', () => {
      let coordinatesServiceSpy;

      coordinatesServiceSpy = spyOn(coordinatesService.coordinates$, 'subscribe');
      component.subscribeToServices();

      expect(coordinatesServiceSpy).toHaveBeenCalled();
    });
  });

});
