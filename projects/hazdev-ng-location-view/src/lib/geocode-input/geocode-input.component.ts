import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { GeocodeService } from '../geocode.service';
import { CoordinatesService } from '../coordinates.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'location-input-geocode',
  templateUrl: './geocode-input.component.html',
  styleUrls: ['./geocode-input.component.css']
})
export class GeocodeInputComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  showProgressBar: boolean;
  subscription = new Subscription();

  constructor(
    public coordinatesService: CoordinatesService,
    public geocodeService: GeocodeService,
    public dialogRef: MatDialogRef<GeocodeInputComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.showProgressBar = false;

    // subscribe to geocode changes
    this.subscription.add(
      this.geocodeService.location$.subscribe((location) => {
        if (location) {
          this.setCoordinates(location);
          this.geocodeService.empty();
        } else {
          this.showProgressBar = false;
        }
      })
    );

    this.addressForm = this.fb.group({
      'address': ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  doGeocode (value: any): void {
    const address = value.address;

    if (this.addressForm.invalid) {
      return;
    }

    // get lat/lng from geocode service
    this.geocodeService.getLocation(address);

    // show progress barr
    this.showProgressBar = true;
  }

  setCoordinates (location: any): void {
    let confidence,
        latitude,
        longitude,
        zoom;

    // compute confidence
    confidence = this.coordinatesService.computeFromGeocode(location);

    // compute zoom
    zoom = this.coordinatesService.computeZoomFromConfidence(confidence);

    // round latitude and longitude values based on confidence
    latitude = this.coordinatesService.roundLocation(+location.feature.geometry.y, confidence);
    longitude = this.coordinatesService.roundLocation(+location.feature.geometry.x, confidence);


    // set coordinates
    this.coordinatesService.setCoordinates({
      confidence: confidence,
      latitude: latitude,
      longitude: longitude,
      method: 'geocode',
      zoom: zoom,
      name: location.name
    });

    // close dialog and stop progress spinner
    this.showProgressBar = false;
    this.dialogRef.close();
  }
}
