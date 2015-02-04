'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var DEFAULTS = {
  north: null,
  south: null,
  east: null,
  west: null
};

var RectangleModel = function (params) {
  var _this,
      _initialize;

  params = Util.extend({}, DEFAULTS, params);

  _this = Object.create(new Model(params));

  _initialize = function () {
    params = null;
  };

  _initialize();
  return _this;
};

module.exports = RectangleModel;