/* global chai, describe, it, beforeEach */
'use strict';

var expect = chai.expect,
    ZoomToControl = require('locationview/ZoomToControl'),
    L = require('leaflet');

var control = null;

var map = new L.Map(L.DomUtil.create('div', 'map'), {
  center: new L.LatLng(40.0, -105.0),
  zoom: 3
});
var natgeo = new L.TileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');


map.addLayer(natgeo);


describe('ZoomTo Control tests suite', function () {

  beforeEach(function () {
    var locations;

    locations = [
      {
        title:'California',
        bounds: [[42,-125], [32,-113]]
      },
      {
        title:'Alaska',
        bounds: [[72,-175], [50,-129]]
      },
    ];

  control = new ZoomToControl({locations:locations});

  map.addControl(control);
  });

  describe('Class Definition', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(ZoomToControl).to.not.be.null;
      /* jshint +W030 */
    });

    it('Can be instantiated', function () {

      /* jshint -W030 */
      expect(control).to.not.be.null;
      expect(control.method).to.not.be.null;
      /* jshint +W030 */
    });
  });

});
