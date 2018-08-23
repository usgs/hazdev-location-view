import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CoordinatesService } from '../coordinates.service';

@Component({
  selector: 'location-input-coordinate',
  templateUrl: './coordinate-input.component.html',
  styleUrls: ['./coordinate-input.component.css']
})
export class CoordinateInputComponent implements OnDestroy, OnInit {
  coordinatesForm: FormGroup;
  subscription = new Subscription();

  @Output()
  location = new EventEmitter();

  constructor(
    public coordinatesService: CoordinatesService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    let latitude, longitude;

    this.subscription.add(
      this.coordinatesService.coordinates$.subscribe(coordinates => {
        latitude = coordinates ? coordinates.latitude : '';
        longitude = coordinates ? coordinates.longitude : '';
      })
    );

    this.coordinatesForm = this.fb.group({
      latitude: [latitude, Validators.required],
      longitude: [longitude, Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleSubmit(value: any) {
    let confidence, latitude, longitude, zoom;

    latitude = value.latitude;
    longitude = value.longitude;

    if (this.coordinatesForm.invalid) {
      return;
    }

    // compute confidence
    confidence = this.coordinatesService.computeFromCoordinates(
      latitude,
      longitude
    );

    // compute zoom
    zoom = this.coordinatesService.computeZoomFromConfidence(confidence);

    // set location
    this.coordinatesService.setCoordinates({
      confidence: confidence,
      latitude: +latitude,
      longitude: +longitude,
      method: 'coordinate',
      zoom: zoom
    });

    // to close dialog
    this.location.emit('setLocation');
  }
}
