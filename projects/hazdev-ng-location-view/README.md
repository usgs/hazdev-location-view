# Hazdev Angular Location View

User interface to accept a geolocated, geocoded, or coordinate location to be
2iew.

## Using the Location View

Install the hazdev-ng-location-view
```
npm install hazdev-ng-location-view
```

Add leaflet assets if you are using the LocationMapComponent (npm install
leaflet if you)
```
  {
    "glob": "**/*",
    "input": "node_modules/leaflet/dist/images",
    "output": "/leaflet"
  }
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


Subscribe to the `CoordinatesService` to access the selected location
```
import { Coordinates, CoordinatesService } from 'hazdev-ng-location-view';

this.coordinatesService.coordinates$.subscribe((coordinates: Coordinates) => {
 console.log(coordinates);
});
```
