import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogRef,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressBarModule
} from '@angular/material';

import { LocationDialogComponent } from './location-dialog.component';

describe('LocationDialogComponent', () => {
  let component: LocationDialogComponent;
  let fixture: ComponentFixture<LocationDialogComponent>;

  beforeEach(async(() => {
    const dialogStub = {
      close: () => {
        console.log('stubbified!');
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        LocationDialogComponent,
        MockComponent({selector: 'location-input-coordinate'}),
        MockComponent({selector: 'location-input-geocode'}),
        MockComponent({selector: 'location-input-geolocate'})
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
