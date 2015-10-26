/* global chai, describe, it, before, after, sinon */
'use strict';

var expect = chai.expect,
    GeocodeControl = require('locationview/GeocodeControl'),
    L = require('leaflet');

var getClickEvent = function () {
  var clickEvent = document.createEvent('MouseEvents');

  clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
  return clickEvent;
};

var getKeyboardEvent = function (type, keyCode) {
  var ev = document.createEvent('KeyboardEvent');

  if (typeof ev.initKeyEvent === 'function') {
  // https://developer.mozilla.org/en-US/docs/Web/API/event.initKeyEvent
    ev.initKeyEvent(
      type,
      true, // bubble
      true, // cancelable
      document.defaultView, // view
      false, // ctrl
      false, // alt
      false, // shift
      false, // meta
      keyCode, // keyCode
      0 // charCode
    );
  } else {
  // http://stackoverflow.com/questions/10455626/
  //    keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key
    ev.initKeyboardEvent(
      type, // type
      true, // bubble
      true, // cancelable
      document.defaultView, // view
      null, // key identifier
      null, // location
      null //modifiers
    );
  }
  return ev;
};

describe('GeocodeControl test suite', function () {
  describe('Class Definition', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(GeocodeControl).to.not.be.null;
      /* jshint +W030 */
    });
  });

  describe('initialize()', function () {
    var g = new GeocodeControl();

    it('Can be instantiated', function () {
      expect(g).to.be.an.instanceof(GeocodeControl);
    });

    it('sets options on itself', function () {
      expect(g.options).to.be.an.instanceof(Object);
    });
  });

  describe('setLocation()', function () {
    it('sets its location', function () {
      var loc = {},
          g = new GeocodeControl(),
          map = new L.Map(L.DomUtil.create('div', 'map'), {});

      map.addControl(g);
      g.setLocation(loc);
      expect(g._location).to.equal(loc);
    });
  });

  describe('getLocation()', function () {
    it('can get its location', function () {
      var loc = {},
          g = new GeocodeControl();

      g._location = loc;
      expect(g.getLocation()).to.equal(loc);
    });
  });

  describe('onAdd()', function () {
    var g = new GeocodeControl();

    it('Check for map', function () {
      /* jshint -W030 */
      expect(g._map).to.not.be.null;
      /* jshint +W030 */
    });
  });

  describe('_onSearchClick()', function () {
    var g = new GeocodeControl();

    it('Should fire in response to clicks', function () {
      var clickSpy = sinon.spy(g, '_onSearchClick');

      g.onAdd(null);
      g._submit.dispatchEvent(getClickEvent());
      expect(clickSpy.callCount).to.equal(1);
      clickSpy.restore();
    });

    it('Does not call _doGeocode when value is empty', function () {
      var geocodeSpy = sinon.spy(g, '_doGeocode');

      g._onSearchClick();
      expect(geocodeSpy.callCount).to.equal(0);
      geocodeSpy.restore();
    });

    it('Does call _doGeocode when value is not empty', function () {
      var geocodeSpy = sinon.spy(g, '_doGeocode');

      g._address.value = 'Colorado';
      g._onSearchClick();
      expect(geocodeSpy.callCount).to.equal(1);
      geocodeSpy.restore();
    });
  });

  describe('toggle()', function () {
    it('Should fire in response to clicks', function () {
      var g = new GeocodeControl(),
          clickSpy = sinon.spy(g, 'toggle');

      g.onAdd(null);
      g._toggle.dispatchEvent(getClickEvent());
      expect(clickSpy.callCount).to.equal(1);
      clickSpy.restore();
    });

    it('Should change class', function () {
      var g = new GeocodeControl();

      g.onAdd(null);
      /* jshint -W030 */
      expect(g._container.classList.contains(
          'location-control-enabled')).to.be.false;
      g.toggle();
      expect(g._container.classList.contains(
          'location-control-enabled')).to.be.true;
      g.toggle();
      expect(g._container.classList.contains(
          'location-control-enabled')).to.be.false;
      /* jshint +W030 */
    });
  });

  describe('_onKeyUp()', function () {
    var g = new GeocodeControl(),
        doGeocodeSpy;

    before(function () {
      doGeocodeSpy = sinon.spy(g, '_doGeocode');
      // make sure text input is defined
      g.onAdd(null);
    });

    after(function () {
      doGeocodeSpy.restore();
    });

    it('is called on textInput keyup event', function () {
      var keyUpSpy = sinon.spy(g, '_onKeyUp');

      // rebind spy version of onKeyUp
      g.onAdd(null);
      g._address.dispatchEvent(getKeyboardEvent('keyup', 13));
      expect(keyUpSpy.called).to.equal(true);
      keyUpSpy.restore();
    });

    it('Does not call _doGeocode when value is empty', function () {
      g._address.value = '';
      g._onKeyUp({keyCode:13});
      expect(doGeocodeSpy.called).to.equal(false);
    });

    it('Does not call _doGeocode when keyCode is not 13', function () {
      g._address.value = 'test';
      g._onKeyUp({keyCode:14});
      expect(doGeocodeSpy.called).to.equal(false);
    });

    it('Calls _doGeocode when keyCode is 13 and value is not empty',
        function () {
      g._address.value = 'test';
      g._onKeyUp({keyCode:14});
      expect(doGeocodeSpy.called).to.equal(false);
    });
  });
});
