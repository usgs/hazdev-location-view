import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
} from '@angular/material';

import { CoordinateInputComponent } from './coordinate-input/coordinate-input.component';
import { CoordinatesService } from './coordinates.service';
import { GeocodeInputComponent } from './geocode-input/geocode-input.component';
import { GeocodeService } from './geocode.service';
import { GeolocateInputComponent } from './geolocate-input/geolocate-input.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';

@NgModule({
  imports: [
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
  entryComponents: [LocationDialogComponent],
  declarations: [
    CoordinateInputComponent,
    GeocodeInputComponent,
    GeolocateInputComponent,
    LocationDialogComponent
  ],
  exports: [
    CoordinateInputComponent,
    GeocodeInputComponent,
    GeolocateInputComponent,
    LocationDialogComponent
  ],
  providers: []
})
export class LocationViewModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocationViewModule,
      providers: [CoordinatesService, GeocodeService]
    };
  }
}
