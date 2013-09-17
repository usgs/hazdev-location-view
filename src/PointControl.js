/* global define */
define([
	'leaflet'
], function (
	L
) {
	'use strict';

	var POINT_CONTROL_INPUT_METHOD = 'PointControl';
	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false
	};

	var PointControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULT_OPTIONS, options));
			this._loc = this.options.defaultLocation || null;

			if (this._loc !== null) {
				this._marker = new L.Marker([this._loc.latitude, this._loc.longitude],
					{draggable:true});
			} else {
				this._marker = new L.Marker([0, 0], {draggable: true});
			}

			this._isEnabled = this.options.defaultEnabled;
		},

		setLocation: function (loc, options) {
			// Save internal reference
			this._loc = loc;

			// Update marker position
			if (this._isEnabled) {
				if (!this._marker._map) {
					this._marker.addTo(this._map);
				}

				this._marker.setLatLng(new L.LatLng(loc.latitude, loc.longitude));
			}

			if (!(options && options.hasOwnProperty('silent') && options.silent)) {
				this.fire('location', this._loc);
			}
		},

		getLocation: function () {
			return this._loc;
		},

		onAdd: function (map) {
			var container = this._container = L.DomUtil.create('a',
					'leaflet-point-control');

			this._map = map;

			// If enabled, bind map click handlers
			if (this.options.defaultEnabled) {
				this._enableControl();
			}

			// Enable/disable control if user clicks on it
			L.DomEvent.addListener(container, 'click', this._toggleEnabled, this);

			if (this._loc !== null) {
				this._marker.addTo(map);
			}

			return container;
		},

		onRemove: function (map) {

			if (this._isEnabled) {
				this._unbindMapEventHandlers(map);
				this._isEnabled = false;
			}

			L.DomEvent.removeListener(this._container, 'click', this._toggleEnabled);

			this._map = null;
			this._container = null;
		},

		_bindMapEventHandlers: function (map) {
			map.on('click', this._onClick, this);
		},

		_unbindMapEventHandlers: function (map) {
			map.off('click', this._onClick, this);
		},

		_onClick: function (mouseEvent) {
			this.setLocation(this._createPointLocation(mouseEvent.latlng));
		},

		_createPointLocation: function (latlng) {
			return {
				place: this._formatPlaceFromCoordinates(latlng),
				latitude: latlng.lat,
				longitude: latlng.lng,
				method: POINT_CONTROL_INPUT_METHOD,
				confidence: this._computeConfidence(),
				accuracy: null
			};
		},

		_computeConfidence: function () {
			// TODO :: Use a confidence calculator
			//return this._confidenceCalculator.computeFromPoint(this._map.getZoom());
			return 'FooConfidence';
		},

		_toggleEnabled: function (clickEvent) {
			if (this._isEnabled) {
				this._disableControl();
			} else {
				this._enableControl();
			}
			L.DomEvent.stop(clickEvent);
		},

		_enableControl: function () {
				L.DomUtil.addClass(this._container, 'leaflet-point-control-enabled');
				this._bindMapEventHandlers(this._map);
				this._isEnabled = true;
		},

		_disableControl: function () {
			L.DomUtil.removeClass(this._container, 'leaflet-point-control-enabled');
			this._unbindMapEventHandlers(this._map);
			this._isEnabled = false;
		},

		_formatPlaceFromCoordinates: function (latlng) {
			var lat = latlng.lat,
			    lng = latlng.lng,
			    latStr = (lat < 0.0) ? '&deg;S' : '&deg;N',
			    lngStr = (lng < 0.0) ? '&deg;W' : '&deg;E';

			return '' + Math.abs(lat).toFixed(2) + latStr + ', ' +
					Math.abs(lng).toFixed(2) + lngStr;
		}
	});

	return PointControl;
});
