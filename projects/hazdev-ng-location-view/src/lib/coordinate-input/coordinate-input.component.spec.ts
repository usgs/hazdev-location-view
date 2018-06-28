import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoordinateInputComponent } from './coordinate-input.component';

import { Coordinates } from '../coordinates';
import { CoordinatesService } from '../coordinates.service';


describe('CoordinateInputComponent', () => {
  let component: CoordinateInputComponent;
  let fixture: ComponentFixture<CoordinateInputComponent>;
  let setCoordinatesSpy;
  let computeFromCoordinatesSpy;
  let computeZoomFromConfidenceSpy;
  let dialog;
  let dialogSpy;
  let coordinatesService;

  const coordinates = {
    confidence: 1,
    latitude: 35,
    longitude: -105,
    method: 'coordinate',
    zoom: 16
  };

  beforeEach(async(() => {
    const coordinatesServiceStub = {
      setCoordinates: (location: any) => {
        console.log('stubbified!');
      },
      computeFromCoordinates: (latitude: string, longitude: string) => {
        console.log('stubbified!');
      },
      computeZoomFromConfidence: (confidence: number) => {
        console.log('stubbified!');
      },
      coordinates$: {
        subscribe: () => {
          console.log('stubbified!');
        }
      }
    };

    const dialogStub = {
      close: () => {
        console.log('stubbified!');
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        CoordinateInputComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: CoordinatesService, useValue: coordinatesServiceStub},
        {provide: MatDialogRef, useValue: dialogStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinateInputComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    // stub services
    coordinatesService = fixture.debugElement.injector.get(CoordinatesService);
    setCoordinatesSpy = spyOn(coordinatesService, 'setCoordinates');
    computeFromCoordinatesSpy = spyOn(coordinatesService,
        'computeFromCoordinates').and.returnValue(coordinates.confidence);
    computeZoomFromConfidenceSpy = spyOn(coordinatesService,
        'computeZoomFromConfidence').and.returnValue(coordinates.zoom);
    dialog = fixture.debugElement.injector.get(MatDialogRef);
    dialogSpy = spyOn(dialog, 'close');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSubmit', () => {
    it('should handle click', () => {
      let latitudeControl,
          longitudeControl;

      latitudeControl = component.coordinatesForm.controls['latitude'];
      longitudeControl = component.coordinatesForm.controls['longitude'];

      // check state of form and input controls, should all be invalid
      expect(latitudeControl.valid).toBeFalsy();
      expect(longitudeControl.valid).toBeFalsy();
      expect(component.coordinatesForm.valid).toBeFalsy();

      // put the from into a valid state
      latitudeControl.setValue(coordinates.latitude);
      longitudeControl.setValue(coordinates.longitude);

      // check valid state
      expect(latitudeControl.valid).toBeTruthy();
      expect(longitudeControl.valid).toBeTruthy();
      expect(component.coordinatesForm.valid).toBeTruthy();

      // call handleSubmit
      component.handleSubmit(coordinates);

      // expects
      expect(coordinatesService.setCoordinates).toHaveBeenCalled();
      expect(coordinatesService.setCoordinates).toHaveBeenCalledWith(
          coordinates);
      expect(coordinatesService.computeFromCoordinates).toHaveBeenCalledWith(
          coordinates.latitude, coordinates.longitude);
      expect(coordinatesService.computeZoomFromConfidence).toHaveBeenCalledWith(
          coordinates.confidence);
      expect(dialog.close).toHaveBeenCalled();
    });
  });
});
