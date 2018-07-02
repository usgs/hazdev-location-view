# Hazdev Angular Location View

User interface to accept a geolocated, geocoded, or coordinate location to be
2iew.

## Dependecies

Angular Material `npm install @angular/material`
BrowserAnimationsModule `npm install @angular/platform-browser/animations`
BrowserModule `npm install @angular/platform-browser'`
Leaflet `npm install leaflet`

## Using the Location View

Install the hazdev-ng-location-view
```
npm install hazdev-ng-location-view
```

Import the LocationInputModule to use the location input
```
import { LocationInputModule } from 'hazdev-ng-location-view';
…
@NgModule({
  imports: [
    LocationInputModule.forRoot()
  ],
  …
})
```

Add the LocationMapComponent to your application
```
<location-view-map></location-view-map>
```

Add leaflet assets (to angular.json)
```
"assets": [
  {
    "glob": "**/*",
    "input": "node_modules/leaflet/dist/images",
    "output": "/leaflet"
  }
]
```

Add leaflet styles (to angluar.json)
```
"styles": [
  "node_modules/leaflet/dist/leaflet.css"
]
```

Subscribe to the `CoordinatesService` to access the selected location
```
import { Coordinates, CoordinatesService } from 'hazdev-ng-location-view';

this.coordinatesService.coordinates$.subscribe((coordinates: Coordinates) => {
 console.log(coordinates);
});
```
