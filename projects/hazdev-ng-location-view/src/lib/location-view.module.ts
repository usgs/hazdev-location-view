import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { CoordinateInputComponent } from './coordinate-input/coordinate-input.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LocationMapComponent } from './location-map/location-map.component';
import { GeolocateInputComponent } from './geolocate-input/geolocate-input.component';
import { GeocodeInputComponent } from './geocode-input/geocode-input.component';

import { CoordinatesService } from './coordinates.service';
import { GeocodeService } from './geocode.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LocationDialogComponent
  ],
  declarations: [
    CoordinateInputComponent,
    GeocodeInputComponent,
    GeolocateInputComponent,
    LocationDialogComponent,
    LocationMapComponent
  ],
  exports: [
    CoordinateInputComponent,
    GeocodeInputComponent,
    GeolocateInputComponent,
    LocationDialogComponent,
    LocationMapComponent,
  ],
  providers: [
  ]
})
export class LocationViewModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocationViewModule,
      providers: [
        CoordinatesService,
        GeocodeService
      ]
    };
  }
}
