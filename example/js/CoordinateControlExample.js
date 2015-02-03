'use strict';

var CoordinateControl = require('CoordinateControl'),
    L = require('LeafletShim');

var map = new L.Map(document.querySelector('.map'), {
    center: new L.LatLng(40.0, -105.0),
    zoom: 3
  });
var cc = new CoordinateControl();
var natgeo = new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');
var marker = new L.Marker(new L.LatLng(0, 0), {draggable:false});

map.addLayer(natgeo);
map.addControl(cc);

cc.on('location', function (loc) {
  var location;
  if (loc.location) {
    location = loc.location;
  }
  marker.setLatLng(new L.LatLng(location.latitude, location.longitude));
  if (! marker._map) {
    map.addLayer(marker);
  }
});

if (!L.Icon.Default.imagePath) {
  L.Icon.Default.imagePath = '/leaflet/images';
}