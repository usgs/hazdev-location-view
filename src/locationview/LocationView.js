'use strict';


var L = require('leaflet'),
    LocationControl = require('locationview/LocationControl'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util');


var DEFAULTS = {
  autoOpen: false,
  includePointControl: true,       // Manages location via pin on map
  includeCoordinateControl: true,  // Manages location via lat/lng input
  includeGeocodeControl: true,     // Manages location via address input
  includeGeolocationControl:       // Manages location via auto-detect (W3C)
      navigator && 'geolocation' in navigator,
  callback: function (/*location*/) {}
};


/**
 * Helper method to get URLs for any ArcGIS Online map tiles.
 *
 * @param serviceName {String}
 *        The name of the map tile service for which to return a URL template.
 *
 * @return {String}
 *         The service URL template for use in an L.TileLayer.
 */
var __get_arcgisonline_url = function (serviceName) {
  var urlPrefix = '//server.arcgisonline.com/ArcGIS/rest/services/',
      urlSuffix = '/MapServer/tile/{z}/{y}/{x}';

  return urlPrefix + serviceName + urlSuffix;
};


/**
 * @constructor
 * Creates a new LocationView.
 *
 * @param params {Object}
 *        An object containing configuration params. See DEFAULTS for
 *        detailed documentation on what can be specified.
 */
var LocationView = function (params) {
  var _this,
      _initialize,

      _callback,
      _includeCoordinateControl,
      _includeGeocodeControl,
      _includeGeolocationControl,
      _includePointControl,
      _locationControl,
      _map,
      _mapContainer,
      _modal,

      _createMap,
      _createModal,
      _onLocation;


  _this = {};

  _initialize = function () {
    params = Util.extend({}, DEFAULTS, params || {});

    _callback = params.callback;
    _includePointControl = params.includePointControl;
    _includeGeolocationControl = params.includeGeolocationControl;
    _includeGeocodeControl = params.includeGeocodeControl;
    _includeCoordinateControl = params.includeCoordinateControl;

    _createMap();   // Defines this._map as a Leaflet map
    _createModal(); // Defines this._modal as a ModalView

    if (params.autoOpen) {
      _this.show();
    }

    params = null;
  };

  /**
   * @PrivateInitializer
   * Called during construction. Creates and initializes the map component.
   *
   * Defines:
   *      _map {L.Map}
   *      _mapContainer {DomElement}
   *      _locationControl {LocationControl}
   *
   */
  _createMap = function () {
    var layerControl = new L.Control.Layers();

    _mapContainer = document.createElement('div');
    _mapContainer.classList.add('locationview-map');

    _map = new L.Map(_mapContainer, {
      zoomControl: true,
      attributionControl: false
    });

    _map.fitBounds([[70.0, -170.0], [-50.0, 170.0]]);

    layerControl.addBaseLayer(new L.TileLayer(
        __get_arcgisonline_url('NatGeo_World_Map'))
        .addTo(_map), 'Topography');
    layerControl.addBaseLayer(new L.TileLayer(
        __get_arcgisonline_url('Canvas/World_Light_Gray_Base')), 'Grayscale');
    layerControl.addBaseLayer(new L.TileLayer(
        __get_arcgisonline_url('World_Imagery')), 'Satellite');

    // TODO :: Use a real location control
    _locationControl = new LocationControl({
      el: _mapContainer,
      includePointControl: _includePointControl,
      includeCoordinateControl: _includeCoordinateControl,
      includeGeocodeControl: _includeGeocodeControl,
      includeGeolocationControl: _includeGeolocationControl
    });
    _locationControl.enable();
    _map.addControl(layerControl);          // Layer switcher
    _map.addControl(_locationControl); // Methods to set locations
  };

  /**
   * @PrivateInitializer
   * Called during construction. Creates and initializes the modal component.
   *
   * Defines:
   *      this._modal {ModalView}
   *
   */
  _createModal = function () {
    _modal = new ModalView(_mapContainer, {
      title: 'Specify a Location',
      classes: ['locationview'],
      buttons: [
        {
          text: 'Use this Location',
          classes: ['locationview-button'],
          callback: function () {
            _callback(_locationControl.getLocation());
            _modal.hide();
          }
        }
      ]
    });
    _locationControl.on('location', _onLocation);
    /* Called initially to disable the button if you enter the location view
     * with no location information, or enable it if location information exists
     */
    _onLocation();
  };


  /**
   * @PrivateInitializer
   * Toggles the "Use this Location" button in the footer of the modal view to
   * to be disabled when the location is null and enabled otherwise.
   *
   */
  _onLocation = function (e) {
    var button = _modal.el.querySelector('.locationview-button'),
        location;

    if (e) {
      if (e.type === 'location') {
        location = e.location;
      }
    }

    if (location) {
      button.disabled = false;
      button.innerHTML = 'Use this Location';
      button.classList.add('locationview-button-enabled');
      button.classList.remove('locationview-button-disabled');
    } else {
      button.disabled = true;
      button.innerHTML = 'No Location Selected';
      button.classList.add('locationview-button-disabled');
      button.classList.remove('locationview-button-enabled');
    }

  };


  /**
   * @APIMethod
   * Hides the LocationView.
   *
   */
  _this.hide = function () {
    _modal.hide();
  };

  /**
   * @APIMethod
   * Shows the LocationView. If no options are specified, there is no default
   * location displayed and the map will show roughly one instance of the
   * entire world.
   *
   * @param options {Object}
   *        Configuration options for default extent and location when the
   *        LocationView is shown.
   *
   *        extent {Array{Array{Number}}}
   *             An array defining the map extent. The first element of this
   *             array is an array containing numbers representing the
   *             latitude and longitude of the top-left corner of the extent.
   *             The second element of this array is an array containing
   *             numbers representing the latitude and longitude of the bottom
   *             right corner of the extent.
   *        location {Object}
   *             A location object to use as the starting location. This
   *             location will be displayed initially and also returned if the
   *             user does not change it. If null, any previously set location
   *             is cleared.
   */
  _this.show = function (options) {
    _modal.show();
    _this.updateMap(options);
  };

  /**
   * @APIMethod
   * Sets initial map display when showing the map.
   *
   * @param options {Object}
   *        Options for setting initial map display properties when showing
   *        the location view. See LocationView.show for more details.
   */
  _this.updateMap = function (options) {
    options = options || {};
    _map.invalidateSize();

    if (options.hasOwnProperty('location')) {
      _locationControl.setLocation(options.location);
    }

    if (options.hasOwnProperty('extent')) {
      _map.fitBounds(options.extent);
    }
  };


  _initialize();
  return _this;
};


module.exports = LocationView;
