/* global describe, it, before, after */
'use strict';

var expect = require('chai').expect,
    LocationView = require('LocationView');

describe('LocationView test suite', function () {

  describe('Constructor', function () {
    it('Can be required.', function () {
      /* jshint -W030 */
      expect(LocationView).to.not.be.null;
      /* jshint +W030 */
    });

    it('Has all expected methods.', function () {
      var l = LocationView();

      expect(l).to.respondTo('hide');
      expect(l).to.respondTo('show');
      expect(l).to.respondTo('updateMap');
    });

    it('Auto-opens if the option is specified.', function () {
      var l = LocationView({autoOpen: true});
      expect(document.querySelectorAll('.modal').length).to.equal(1);
      l.hide();
    });
  });

  describe('show', function () {
    var l = LocationView();

    before(function () {
      l.show();
    });

    it('Has been added to the DOM.', function () {
      expect(document.querySelectorAll('.modal').length).to.equal(1);
    });

    after(function () {
      l.hide();
    });
  });

});