/* global define */
define([
	'leaflet',

	'util/Util',
	'mvc/ModalView',

	'LocationControl'
], function (
	L,

	Util,
	ModalView,

	LocationControl
) {
	'use strict';

	var DEFAULTS = {
		autoOpen: false,
		includePointControl: false,       // Manages location via pin on map
		includeCoordinateControl: false,  // Manages location via lat/lng input
		includeGeocodeControl: false,     // Manages location via address input
		includeGeolocateControl: false,   // Manages location via auto-detect (W3C)
		callback: function (/*location*/) {}
	};


	// ----------------------------------------------------------------------
	// Static Methods
	// ----------------------------------------------------------------------


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


	// ----------------------------------------------------------------------
	// Initialization Methods
	// ----------------------------------------------------------------------


	/**
	 * @constructor
	 * Creates a new LocationView.
	 *
	 * @param options {Object}
	 *        An object containing configuration options. See DEFAULTS for
	 *        detailed documentation on what can be specified.
	 */
	var LocationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options || {});

		this._createMap();   // Defines this._map as a Leaflet map
		this._createModal(); // Defines this._modal as a ModalView

		if (this._options.autoOpen) {
			this.show();
		}
	};

	/**
	 * @PrivateInitializer
	 * Called during construction. Creates and initializes the map component.
	 *
	 * Defines:
	 *      this._map {L.Map}
	 *      this._mapContainer {DomElement}
	 *      this._locationControl {LocationControl}
	 *
	 */
	LocationView.prototype._createMap = function () {
		var layerControl = new L.Control.Layers();

		this._mapContainer = document.createElement('div');
		this._mapContainer.classList.add('location-view-map');

		this._map = new L.Map(this._mapContainer, {
			zoomControl: true,
			attributionControl: false
		});

		layerControl.addBaseLayer(new L.TileLayer(
				__get_arcgisonline_url('NatGeo_World_Map'))
				.addTo(this._map), 'Topography');
		layerControl.addBaseLayer(new L.TileLayer(
				__get_arcgisonline_url('Canvas/World_Light_Gray_Base')), 'Grayscale');
		layerControl.addBaseLayer(new L.TileLayer(
				__get_arcgisonline_url('World_Imagery')), 'Satellite');

		// TODO :: Use a real location control
		this._locationControl = new LocationControl({
			el: this._mapContainer,
			includePointControl: this._options.includePointControl,
			includeCoordinateControl: this._options.includeCoordinateControl,
			includeGeocodeControl: this._options.includeGeocodeControl,
			includeGeolocateControl: this._options.includeGeolocateControl
		});

		// TODO :: Remove these faky methods in favor of real class implementation
		this._locationControl.getLocation = function () {
			return {
				place: '40&deg;N, 105&deg;W',
				latitude: 40,
				longitude: -105,
				method: 'PointControl',
				confidence: 3,
				accuracy: null
			};
		};
		this._locationControl.setLocation = function () {};
		this._locationControl.addTo = function () { return null; };

		this._map.addControl(layerControl);          // Layer switcher
		this._map.addControl(this._locationControl); // Methods to set locations
	};

	/**
	 * @PrivateInitializer
	 * Called during construction. Creates and initializes the modal component.
	 *
	 * Defines:
	 *      this._modal {ModalView}
	 *
	 */
	LocationView.prototype._createModal = function () {
		var _this = this;

		this._modal = new ModalView(this._mapContainer, {
			title: 'Specify a Location',
			classes: ['location-view'],
			buttons: [
				{
					text: 'Use this Location',
					callback: function () {
						_this._options.callback(_this._locationControl.getLocation());
						_this._modal.hide();
					}
				}
			]
		});
	};


	// ----------------------------------------------------------------------
	// Public Methods
	// ----------------------------------------------------------------------


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
	 *        initialLocation {Object}
	 *             A location object to use as the starting location. This
	 *             location will be displayed initially and also returned if the
	 *             user does not change it. If null, any previously set location
	 *             is cleared.
	 */
	LocationView.prototype.show = function (options) {
		this._modal.show();
		this._updateMap(options);
	};


	// ----------------------------------------------------------------------
	// Private Methods
	// ----------------------------------------------------------------------


	/**
	 * Sets initial map display when showing the map.
	 *
	 * @param options {Object}
	 *        Options for setting initial map display properties when showing
	 *        the location view. See LocationView.show for more details.
	 */
	LocationView.prototype._updateMap = function (options) {
		options = options || {};

		this._map.invalidateSize();

		if (options.hasOwnProperty('extent')) {
			this._map.fitBounds(options.extent);
		} else {
			this._map.fitBounds([[70.0, -170.0], [-50.0, 170.0]]);
		}

		if (options.hasOwnProperty('initialLocation') &&
				options.initialLocation.hasOwnProperty('latitude') &&
				options.initialLocation.hasOwnProperty('longitude') &&
				options.initialLocation.hasOwnProperty('place') &&
				options.initialLocation.hasOwnProperty('method') &&
				options.initialLocation.hasOwnProperty('confidence') &&
				options.initialLocation.hasOwnProperty('accuracy')) {
			// initialLocation specified and is a location object
			this._locationControl.setLocation(options.initialLocation);
		}
	};


	return LocationView;
});
