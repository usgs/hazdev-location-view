/* global L */
'use strict';

var PointControl = require('locationview/PointControl');


var map = new L.Map(document.querySelector('.map'), {
  center: new L.LatLng(40.0, -105.0),
  zoom: 3
});
var pc = new PointControl();
var natgeo = new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

map.addLayer(natgeo);
map.addControl(pc);

pc.on('location', function (loc) {
  console.log(loc);
});
