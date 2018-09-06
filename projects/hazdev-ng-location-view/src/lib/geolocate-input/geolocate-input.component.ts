import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CoordinatesService } from '../coordinates.service';

@Component({
  selector: 'location-input-geolocate',
  templateUrl: './geolocate-input.component.html',
  styleUrls: ['./geolocate-input.component.css']
})
export class GeolocateInputComponent implements OnInit {
  public errorMessage: string;
  public geolocation: any;
  public showError: boolean;
  public showProgressBar: boolean;

  @Output()
  location = new EventEmitter();

  constructor(private coordinatesService: CoordinatesService) {}

  ngOnInit() {
    this.geolocateSuccess = this.geolocateSuccess.bind(this);
    this.showProgressBar = false;
    this.showError = false;
  }

  doGeolocate(): void {
    this.geolocation = this.getLocation();
    this.showProgressBar = true;
    this.showError = false;

    if (this.geolocation) {
      this.geolocation.getCurrentPosition(
        this.geolocateSuccess,
        this.geolocateError
      );
    } else {
      this.geolocateError({
        code: 0,
        message: 'Geolocation not supported'
      });
    }
  }

  geolocateError(error: any): void {
    this.errorMessage = error.message;
    this.showProgressBar = false;
    this.showError = true;
  }

  geolocateSuccess(position: any): void {
    let confidence, latitude, longitude, zoom;

    // get confidence
    confidence = this.coordinatesService.computeFromGeolocate(position);

    // get zoom
    zoom = this.coordinatesService.computeZoomFromConfidence(confidence);

    // round latitude and longitude values based on confidence
    latitude = this.coordinatesService.roundLocation(
      +position.coords.latitude,
      confidence
    );
    longitude = this.coordinatesService.roundLocation(
      +position.coords.longitude,
      confidence
    );

    this.coordinatesService.setCoordinates({
      confidence: confidence,
      latitude: latitude,
      longitude: longitude,
      method: 'geolocate',
      zoom: zoom
    });

    // to close dialog
    this.location.emit('setLocation');
  }

  getLocation(): any {
    return navigator.geolocation;
  }
}
