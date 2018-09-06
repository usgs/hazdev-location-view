import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CoordinatesService } from '../coordinates.service';

import { GeolocateInputComponent } from './geolocate-input.component';


describe('GeolocateInputComponent', () => {
  let component: GeolocateInputComponent;
  let fixture: ComponentFixture<GeolocateInputComponent>;
  let setCoordinatesSpy;
  let computeFromGeolocateSpy;
  let computeZoomFromConfidenceSpy;
  let dialog;
  let dialogSpy;
  let coordinatesService;
  let roundLocationSpy;


  const point = 35;

  const coordinates = {
    confidence: 3,
    latitude: point,
    longitude: point,
    method: 'geocode',
    name: 'Golden, Colorado',
    zoom: 9
  };

  beforeEach(async(() => {
    const coordinatesServiceStub = {
      setCoordinates: (location: any) => {
        console.log('stubbified!');
      },
      computeFromGeolocate: (accuracy: number) => {
        console.log('stubbified!');
      },
      computeZoomFromConfidence: (confidence: number) => {
        console.log('stubbified!');
      },
      roundLocation: (value: number, confidence: number) => {
        console.log('stubbified!');
      }
    };

    const dialogStub = {
      close: () => {
        console.log('stubbified!');
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        GeolocateInputComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule
      ],
      providers: [
        {provide: CoordinatesService, useValue: coordinatesServiceStub},
        {provide: MatDialogRef, useValue: dialogStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // stub coordinates.service
    coordinatesService = fixture.debugElement.injector.get(CoordinatesService);
    setCoordinatesSpy = spyOn(coordinatesService, 'setCoordinates');
    computeFromGeolocateSpy = spyOn(coordinatesService, 'computeFromGeolocate').and.returnValue(coordinates.confidence);
    computeZoomFromConfidenceSpy = spyOn(coordinatesService, 'computeZoomFromConfidence').and.returnValue(coordinates.zoom);
    roundLocationSpy = spyOn(coordinatesService, 'roundLocation').and.returnValue(point);

    // stub dialog
    dialog = fixture.debugElement.injector.get(MatDialogRef);
    dialogSpy = spyOn(dialog, 'close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doGeolocate', () => {
    it('should call getLocation', () => {
      let getLocationSpy;

      getLocationSpy = spyOn(component, 'getLocation');

      component.doGeolocate();

      expect(getLocationSpy).toHaveBeenCalled();
    });

    it('getCurrentPosition should be called with geolocateSuccess and geolocateError',
        () => {
      let getLocationStub,
          getCurrentPositionSpy;

      getCurrentPositionSpy = jasmine.createSpy('test');

      getLocationStub = spyOn(component, 'getLocation').and.returnValue({
        getCurrentPosition: getCurrentPositionSpy
      });

      component.doGeolocate();

      expect(getCurrentPositionSpy).toHaveBeenCalled();
      expect(getCurrentPositionSpy).toHaveBeenCalledWith(
          component.geolocateSuccess, component.geolocateError);

    });

    it('should call geolocateError', () => {
      let getLocationStub,
          geolocateErrorSpy;

      getLocationStub = spyOn(component, 'getLocation').and.returnValue(null);
      geolocateErrorSpy = spyOn(component, 'geolocateError');

      component.doGeolocate();

      expect(geolocateErrorSpy).toHaveBeenCalled();
    });

    it('should set showProgressBar to false', () => {
      component.doGeolocate();
      expect(component.showProgressBar).toEqual(true);
    });

    it('should set showError to false', () => {
      component.doGeolocate();
      expect(component.showError).toEqual(false);
    });
  });

  describe('geolocateError', () => {
    const error = {message: 'error'};

    it('should set error message', () => {
      component.geolocateError(error);
      expect(component.errorMessage).toEqual('error');
    });

    it('should set showProgressBar to false', () => {
      component.geolocateError(error);
      expect(component.showProgressBar).toEqual(false);
    });

    it('should set ShowError to true', () => {
      component.geolocateError(error);
      expect(component.showError).toEqual(true);
    });
  });

  describe('geolocateSuccess', () => {
    let position;

    position = {
      coords: {
        accuracy: 3222,
        latitude: 39.755,
        longitude: -105.221
      }
    };

    it('calls computeFromGeolocate', () => {
      component.geolocateSuccess(position);

      expect(computeFromGeolocateSpy).toHaveBeenCalled();
    });

    it('calls computeZoomFromConfidence', () => {
      component.geolocateSuccess(position);

      expect(computeZoomFromConfidenceSpy).toHaveBeenCalled();
    });

    it('calls setCoordinates', () => {
      component.geolocateSuccess(position);

      expect(setCoordinatesSpy).toHaveBeenCalled();
    });
  });
});
