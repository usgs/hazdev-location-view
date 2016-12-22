/* global L */
'use strict';

var CoordinateControl = require('locationview/CoordinateControl');


var map = new L.Map(document.querySelector('.map'), {
    center: new L.LatLng(40.0, -105.0),
    zoom: 3
  });
var cc = new CoordinateControl();
var natgeo = new L.TileLayer('https://server.arcgisonline.com' +
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
