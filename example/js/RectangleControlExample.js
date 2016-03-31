/* global L */
'use strict';

var RectangleControl = require('locationview/RectangleControl'),
    RectangleModel = require('locationview/RectangleModel');


var model = RectangleModel();
var map = L.map(document.querySelector('.map'), {
  center: [40.0, -105.0],
  zoom: 3
});
var rect = new RectangleControl({model: model});
var base = L.tileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

model.on('change', function () {
  console.log(model.get());
});

map.addLayer(base);
map.addControl(rect);
