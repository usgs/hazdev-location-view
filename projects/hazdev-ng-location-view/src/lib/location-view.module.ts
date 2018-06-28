import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressBarModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';

import { CoordinateInputComponent } from './coordinate-input/coordinate-input.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LocationMapComponent } from './location-map/location-map.component';
import { GeolocateInputComponent } from './geolocate-input/geolocate-input.component';
import { GeocodeInputComponent } from './geocode-input/geocode-input.component';

import { CoordinatesService } from './coordinates.service';
import { GeocodeService } from './geocode.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule
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
    LocationMapComponent
  ],
  providers: [
  ]
})
export class LocationInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocationInputModule,
      providers: [
        CoordinatesService,
        GeocodeService
      ]
    };
  }
}
