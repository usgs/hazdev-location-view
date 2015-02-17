/* global chai, describe, it, before, after, sinon */
'use strict';

var expect = chai.expect,
    PointControl = require('locationview/PointControl'),
    L = require('leaflet');

var testLoc1 = {
  place: null,
  latitude: 35.0,
  longitude: -118.0,
  method: 'point',
  confidence: 1
};

var testLoc2 = {
  place: null,
  latitude: 40.0,
  longitude: -105.0,
  method: 'point',
  confidence: 1
};

describe('PointControl test suite', function () {

  describe('Class Definition', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(PointControl).not.to.be.null;
      /* jshint +W030 */
    });
  });

  describe('initialize()', function () {
    var p = new PointControl();

    it('Can be instantiated', function () {
      expect(p).to.be.an.instanceof(PointControl);
    });

    it('sets options on itself', function () {
      expect(p.options).to.be.an.instanceof(Object);
    });

    it('has proper default attributes', function () {
      /* jshint -W030 */
      expect(p._marker).to.not.be.null;
      expect(p._isEnabled).to.be.false;
      /* jshint +W030 */
    });
  });

  describe('setLocation()', function () {
    var p = new PointControl();

    it('notifies listeners by default', function () {
      var onSetLocation = sinon.spy();

      p.on('location', onSetLocation);
      p.setLocation(testLoc1);

      expect(onSetLocation.callCount).to.equal(1);
    });

    it('suppresses notifications with silent option', function () {
      var onSetLocation = sinon.spy();

      p.on('location', onSetLocation);
      p.setLocation(testLoc1, {silent: true});

      expect(onSetLocation.callCount).to.equal(0);
    });

    it('passes correct location data to listeners', function () {
      var onSetLocation = sinon.spy();

      p.on('location', onSetLocation);
      p.setLocation(testLoc1);

      /* jshint  -W030 */
      expect(onSetLocation.alwaysCalledWithMatch({'location': testLoc1})).to.be.true;
      /* jshint +W030 */
    });

  });

  describe('getLocation()', function () {
    var p = new PointControl({defaultLocation: testLoc1});

    before(function () {
      p._map = {getZoom: function () { return 3; }};
      p._marker._map = p._map;
    });

    after(function () {
      p._map = null;
      p._marker._map = null;
    });

    it('returns null by default', function () {
      var p = new PointControl();
      var loc = p.getLocation();

      /* jshint -W030 */
      expect(loc).to.be.null;
      /* jshint +W030 */
    });

    it('returns the default location when specified', function () {
      var loc = p.getLocation();
      expect(loc.latitude).to.equal(testLoc1.latitude);
      expect(loc.longitude).to.equal(testLoc1.longitude);
    });

    it('returns the most recently set location', function () {
      expect(p.getLocation()).to.deep.equal(testLoc1);

      p.setLocation(testLoc2);
      expect(p.getLocation()).to.deep.equal(testLoc2);
    });
  });

  describe('onAdd()', function () {
    var p = new PointControl();
    var clickHandler = sinon.spy(p, 'toggle');
    var c = p.onAdd(L.map(document.createElement('div'))).querySelector('a');

    var getClickEvent = function () {
      var clickEvent = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
      return clickEvent;
    };

    it('register a click handler in onAdd method', function () {
      expect(clickHandler.callCount).to.equal(0);

      c.dispatchEvent(getClickEvent());
      expect(clickHandler.callCount).to.equal(1);

      c.dispatchEvent(getClickEvent());
      expect(clickHandler.callCount).to.equal(2);
    });

    it('has a map after adding', function () {
      expect(p._map).to.be.an.instanceof(L.Map);
    });
  });

  describe('onRemove()', function () {
    var p = new PointControl(),
        m = new L.Map(document.createElement('div'));

    p.onAdd(m);
    p.onRemove(m);

    it('should not have a map after removal', function () {
      /* jshint -W030 */
      expect(p._map).to.be.null;
      /* jshint +W030 */
    });
  });

});
