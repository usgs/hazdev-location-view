/* global L */
'use strict';

var ZoomToControl = require('locationview/ZoomToControl');

var locations = [
      {
        title:'Alaska',
        bounds: [[72,-175], [50,-129]]
      },
      {
        title:'California',
        bounds: [[42,-125], [32,-113]]
      },
      {
        title:'Central U.S',
        bounds:[[32,-104],[40,-88]]
      },
      {
        title:'Hawaii',
        bounds: [[22,-160], [18,-154]]
      },
      {
        title:'Puerto Rico',
        bounds: [[20,-70], [16,-62]]
      },
      {
        title:'U.S.',
        bounds:[[50,-125], [24.6,-65]]
      },
      {
        title:'World',
        bounds:[[70,20],[-70,380]]
      }
    ];


var map = new L.Map(document.querySelector('.map'), {
    center: new L.LatLng(40.0, -105.0),
    zoom: 3
  });
var zoomTo = new ZoomToControl({locations:locations});
var natgeo = new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

map.addLayer(natgeo);
map.addControl(zoomTo);

