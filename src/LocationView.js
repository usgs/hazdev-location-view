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
		pointControl: false,       // Manages location via pin on map
		coordinateControl: false,  // Manages location via lat/lng input boxes
		geocodeControl: false,     // Manages location via address input box
		geolocateControl: false,   // Manages location via auto-detect (W3C)
		callback: function (/*location*/) {}
	};

	var __get_arcgisonline_url = function (serviceName) {
		var urlPrefix = 'https://server.arcgisonline.com/ArcGIS/rest/services/',
		    urlSuffix = '/MapServer/tile/{z}/{y}/{x}';

		return urlPrefix + serviceName + urlSuffix;
	};

	var LocationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options || {});

		this._createMap();   // Defines this._map as a Leaflet map
		this._createModal(); // Defines this._modal as a ModalView

		if (this._options.autoOpen) {
			this.show();
		}
	};


	LocationView.prototype.show = function (options) {
		this._modal.show();
		this._updateMap(options);
	};


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
		this._locationControl = new LocationControl(this._options);

		// TODO :: Remove these faky methods in favor of real class implementation
		this._locationControl.getLocation = function () {
			return {
				latitude: 40.0,
				longitude: -105.0,
				precision: 3
			};
		};
		this._locationControl.setLocation = function () {};
		this._locationControl.addTo = function () { return null; };


		this._map.addControl(layerControl);          // Layer switcher
		this._map.addControl(this._locationControl); // Methods to set locations
	};

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
					}
				}
			]
		});
	};

	LocationView.prototype._updateMap = function (options) {
		options = options || {};

		this._map.invalidateSize();

		if (options.hasOwnProperty('extent')) {
			this._map.fitBounds(options.extent);
		} else {
			this._map.fitBounds([[70.0, -170.0], [-50.0, 170.0]]);
		}

		if (options.hasOwnProperty('initialLocation')) {
			this._locationControl.setLocation(options.initialLocation);
		}
	};

	return LocationView;
});
