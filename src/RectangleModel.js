/* global define */
define([
  'mvc/Model',
  'util/Util'
], function (
  Model,
  Util
) {
  'use strict';

  var DEFAULTS = {
    north: null,
    south: null,
    east: null,
    west: null
  };

  var RectangleModel = function (options) {
    var _this,
        _initialize;

    options = Util.extend({}, DEFAULTS, options);

    _this = Object.create(new Model(options));

    _initialize = function () {
    };

    _initialize();
    return _this;
  };

  return RectangleModel;
});