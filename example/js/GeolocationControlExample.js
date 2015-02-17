'use strict';

var GeolocationControl = require('locationview/GeolocationControl'),
    L = require('leaflet');

L.Icon.Default.imagePath = 'images';

var map = new L.Map(document.querySelector('.map'), {
  center: new L.LatLng(40.0, -105.0),
  zoom: 3
});
var glc = new GeolocationControl();
var natgeo = new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

var marker = new L.Marker(new L.LatLng(0, 0), {draggable:true});

map.addLayer(natgeo);
map.addControl(glc);

glc.on('location', function (e) {
  var loc = e.location;
  console.log(loc);
  marker.setLatLng(new L.LatLng(loc.latitude, loc.longitude));

  if (!marker._map) {
    map.addLayer(marker);
  }
});
glc.on('locationError', function (e) {
  console.log(e);
});