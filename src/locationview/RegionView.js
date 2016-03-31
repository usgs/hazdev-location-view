/* global L */
'use strict';

var ModalView = require('mvc/ModalView'),
    RectangleControl = require('locationview/RectangleControl'),
    RectangleCoordinateView = require('locationview/RectangleCoordinateView'),
    RectangleModel = require('locationview/RectangleModel'),
    Util = require('util/Util');

var DEFAULTS = {
  includeRectangle: true,
  includeCircle: false,

  okButtonText: 'Use this Region',
  okButtonDisabledText: 'Specify a Region',

  onRegionCallback: function () {},

  rectangleControlOptions: {},
  rectangleCoordinateOptions: {}
};

var __INSTANCE_COUNTER__ = 0;


var __get_arcgisonline_url = function (serviceName) {
  var urlPrefix = '//server.arcgisonline.com/ArcGIS/rest/services/',
      urlSuffix = '/MapServer/tile/{z}/{y}/{x}';

  return urlPrefix + serviceName + urlSuffix;
};


var RegionView = function (params) {
  var _this,
      _initialize,
      _instanceId,

      _includeRectangle,
      _includeCircle,
      _map,
      _mapContainer,
      _modal,
      _okButtonText,
      _okButtonDisabledText,
      _onRegionCallback,
      _rectangleControl,
      _rectangleControlOptions,
      _rectangleCoordinateOptions,
      _region,

      _createMap,
      _createModal;

  _this = {};

  _initialize = function () {
    _instanceId = __INSTANCE_COUNTER__++;

    params = Util.extend({}, DEFAULTS, params);

    _includeRectangle = params.includeRectangle;
    _includeCircle = params.includeCircle;
    _okButtonText = params.okButtonText;
    _okButtonDisabledText = params.okButtonDisabledText;
    _onRegionCallback = params.onRegionCallback;
    _rectangleControlOptions = params.rectangleControlOptions;
    _rectangleCoordinateOptions = params.rectangleCoordinateOptions;
    _region = params.region || RectangleModel();

    _createMap();
    _createModal();
    _region.on('change', _this.render, _this);
    _this.render();

    if (params._autoOpen) {
      _this.show();
    }

    params = null;
  };


  _createMap = function () {
    _mapContainer = document.createElement('div');
    _mapContainer.classList.add('regionview-map');

    _map = L.map(_mapContainer, {
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer(__get_arcgisonline_url('NatGeo_World_Map')).addTo(_map);
    _map.fitWorld();
    L.control.scale().addTo(_map);

    if (_includeRectangle) {
      _rectangleControl = new RectangleControl(Util.extend({},
          _rectangleControlOptions, {model: _region}));

      _map.addControl(_rectangleControl);
      _map.addControl(new RectangleCoordinateView(Util.extend({},
          _rectangleCoordinateOptions, {model: _region})));
    }
  };

  _createModal = function () {

    _modal = new ModalView(_mapContainer, {
      title: 'Specify a Region',
      classes: ['regionview'],
      buttons: [
        {
          text: 'Use this Region',
          classes: ['regionview-button', 'green'],
          callback: function () {
            _onRegionCallback(_region);
            _modal.hide();
          }
        }
      ]
    });
  };


  _this.render = function () {
    var extent = _region.get(),
        button = _modal.el.querySelector('.regionview-button');

    if (extent.north === null && extent.south === null &&
        extent.east === null && extent.west === null) {
      button.setAttribute('disabled', true);
      button.innerHTML = 'Specify a Region';
    } else {
      button.removeAttribute('disabled');
      button.innerHTML = 'Use this Region';
    }
  };

  _this.show = function (options) {
    var extent = _region.get(),
        enableRectangleControl;
    options = options || {};
    _modal.show();
    _map.invalidateSize();
    enableRectangleControl = options.enableRectangleControl || false;


    if (options.hasOwnProperty('region')) {
      if (options.region) {
        _region.set(options.region);
        enableRectangleControl = true;
      } else {
        _region.set({
        north: null,
        south: null,
        east: null,
        west: null
        }, {force: true});
      }
    }

    if (enableRectangleControl === true) {
      _rectangleControl.enable();
    }

    if (options.extent) {
      extent = options.extent;
    } else {
      extent = [
        [
          (extent.north !== null) ? extent.north : 70.0,
          (extent.east !== null) ? extent.east : 170.0
        ],
        [
          (extent.south !== null) ? extent.south : -50.0,
          (extent.west !== null) ? extent.west : -170.0
        ]
      ];
    }

    // github.com/Leaflet/Leaflet/issues/2021
    window.setTimeout(function(){_map.fitBounds(extent);}, 0);
  };

  _initialize();
  return _this;
};

module.exports = RegionView;
