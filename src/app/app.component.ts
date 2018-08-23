import { AfterViewInit, Component, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Coordinates, CoordinatesService, LocationDialogComponent } from 'hazdev-ng-location-view';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, AfterViewInit {
  baseLayers: L.LayerGroup;
  coordinates: Coordinates;
  layerControl: L.Control.Layers;
  map: L.Map;
  marker: L.Marker;
  subscription = new Subscription();

  @ViewChild('mapWrapper')
  mapWrapper: ElementRef;

  constructor(
    public coordinatesService: CoordinatesService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy() {
    // unbind dragend event
    this.destroyMarker();

    // destroy map
    this.destroyMap();

    // unsubscribe to services
    this.unsubscribeFromServices();
  }

  ngAfterViewInit() {
    // create leaflet map
    this.createMap();

    // create leaflet marker, do not add to map
    this.createMarker();

    // Add baselayers to map
    this.addBaselayers();

    // Add location control to map
    this.addLocationControl();

    // subscribe to location changes and menu toggling
    this.subscribeToServices();
  }

  /**
   * Adds the street, satellite, and terrain baselayers to the map
   *
   */
  addBaselayers(): void {
    let baseMaps, satellite, street, terrain;

    // Street Map
    street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
      attribution:
        'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, ' +
        'Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
        'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the ' +
        'GIS User Community'
    });

    // Satellite Map
    satellite = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, ' +
          'USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the ' +
          'GIS User Community'
      }
    );

    // Terrain Map
    terrain = L.tileLayer(
      'https://services.arcgisonline.com/arcgis/rest/services/' +
        'NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
        attribution:
          'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, ' +
          'Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
          'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the ' +
          'GIS User Community'
      }
    ).addTo(this.map);

    // Group baselayers
    baseMaps = {
      Satellite: satellite,
      Street: street,
      Terrain: terrain
    };

    // Add layer control to map
    this.layerControl = L.control.layers(baseMaps).addTo(this.map);
  }

  /**
   * Creates a location control that opens a material dialog with
   * the LocationDialogComponent as its content.
   *
   */
  addLocationControl(): void {
    let control;

    control = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control ' + 'leaflet-location-control'
    );
    control.innerHTML = '<a class="material-icons">location_searching' + '</a>';

    // open dialog when custom control is clicked
    control.onclick = () => {
      this.openDialog();
    };

    // Create location control to open dialog
    const LocationControl = L.Control.extend({
      options: {
        position: 'topleft'
      },

      initialize: function(options) {
        this._control = options.control;
      },

      onAdd: function(map) {
        return this._control;
      },

      onRemove: function(map) {
        // Nothing to do here
      }
    });

    // Add Location Control to map
    this.map.addControl(
      new LocationControl({
        control: control
      })
    );
  }

  /**
   * Creates a leaflet map
   *
   */
  createMap(): void {
    // Create map (center on US)
    this.map = L.map(this.mapWrapper.nativeElement, {
      center: [38, -95],
      zoom: 4
    });
  }

  /**
   * Creates a marker that will be used to mark the current location
   * on the map.
   *
   */
  createMarker(): void {
    // Create location marker
    this.marker = new L.Marker([0, 0], {
      draggable: true,
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    });

    // bind to dragend on map marker
    this.marker.on('dragend', this.onDragEnd, this);
  }

  /**
   * Unbinds the "dragend" event from the marker on the map
   *
   */
  destroyMarker(): void {
    this.marker.off('dragend', this.onDragEnd, this);
  }

  /**
   * Destroys the map
   *
   */
  destroyMap(): void {
    this.map.remove();
    this.map = null;
  }

  /**
   * Zoom/centers the map on the provided location
   *
   * @param coordinates
   *        A coordinate object that contains a lat/lng & zoom level
   *
   */
  moveMap(coordinates: Coordinates): void {
    // pan/zoom the provided location
    this.map.setView(
      new L.LatLng(coordinates.latitude, coordinates.longitude),
      coordinates.zoom
    );
  }

  /**
   * Update the marker's location on the map. This method will also
   * add the marker to the map if it has not been added.
   *
   * @param coordinates
   *        A coordinate object that contains a lat/lng to plot
   *
   */
  moveMarker(coordinates: Coordinates): void {
    let latLng;

    // Update the position of the marker
    latLng = L.latLng(coordinates.latitude, coordinates.longitude);
    this.marker.setLatLng(latLng);

    // if there is no marker on the map, add marker
    if (!this.map.hasLayer(this.marker)) {
      this.map.addLayer(this.marker);
    }
  }
  /**
   * Open the Location Input Dialog
   */
  openDialog() {
    if (this.dialog && LocationDialogComponent) {
      this.dialog.open(LocationDialogComponent);
    }
  }

  /**
   * Triggered by the dragend event on the marker. This method updates
   * the coordinate service with the marker's new location.
   *
   */
  onDragEnd() {
    let confidence, coordinates, latitude, longitude, zoom;

    // get zoom level from map
    zoom = this.map.getZoom();

    // get confidence from zoom
    confidence = this.coordinatesService.computeFromPoint(zoom);

    // grab coordinates off map marker
    coordinates = this.marker.getLatLng();

    // round latitude and longitude values based on confidence
    latitude = this.coordinatesService.roundLocation(
      +coordinates.lat,
      confidence
    );
    longitude = this.coordinatesService.roundLocation(
      +coordinates.lng,
      confidence
    );

    this.coordinatesService.setCoordinates({
      confidence: confidence,
      latitude: latitude,
      longitude: longitude,
      method: 'point',
      zoom: zoom
    });
  }

  subscribeToServices(): void {
    this.subscription.add(
      this.coordinatesService.coordinates$.subscribe(coordinates => {
        if (coordinates) {
          this.coordinates = coordinates;
          this.moveMarker(coordinates);
          this.moveMap(coordinates);
        }
      })
    );
  }

  unsubscribeFromServices(): void {
    this.subscription.unsubscribe();
  }
}
