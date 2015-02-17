'use strict';

var GeocodeControl = require('locationview/GeocodeControl'),
    L = require('leaflet');

L.Icon.Default.imagePath = 'images';

var map = new L.Map(document.querySelector('.map'), {
  center: new L.LatLng(40.0, -105.0),
  zoom: 3
});
var marker= new L.Marker(new L.LatLng(0,0));
var gc = new GeocodeControl();

map.addLayer(new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'));
map.addControl(gc);

gc.on('location', function (loc) {
  var location;
  if (loc.location) {
    location = loc.location;
  }
  marker.setLatLng(new L.LatLng(location.latitude, location.longitude));
  if (! marker._map) {
    map.addLayer(marker);
  }
});