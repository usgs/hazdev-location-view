/* global chai, describe, it, beforeEach, sinon */
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
      expect(control.options).to.not.be.null;
      expect(control._map).to.not.be.undefined;
      /* jshint +W030 */
    });
  });

  describe('ZoomTo Control', function () {

    it('Can be added', function () {
      /* jshint -W030 */
      expect(control._map).to.not.be.null;
      /* jshint +W030 */
    });

    it('Can be removed', function () {
      //map.removeControl(control);
      control.onRemove();
      /* jshint -W030 */
      expect(control._map).to.be.null;
      /* jshint +W030 */
    });

    it('Can be Selected', function () {
      var element,
          evt,
          save;

      element = control._container.querySelector(
          '.location-zoomto-control-list');

      element.selectedIndex = 1;

      save = sinon.spy(control._map, 'fitBounds');

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      element.dispatchEvent(evt);

      expect(save.callCount).to.equal(1);

      save.restore();

      expect(element.selectedIndex).to.equal(0);
    });
  });
});
