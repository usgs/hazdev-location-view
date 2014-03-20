/* global define */
define([
	'leaflet',
	'ConfidenceCalculator'
], function (
	L,
	ConfidenceCalculator
) {
	'use strict';

	var POINT_CONTROL_INPUT_METHOD = 'PointControl';

	var CLASS_NAME = 'leaflet-point-control';
	var CLASS_ENABLED = CLASS_NAME + '-enabled';
	var CLASS_LOCATION = CLASS_NAME + '-location';
	var CLASS_NO_LOCATION = CLASS_NAME + '-nolocation';

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

			this._isEnabled = this.options.defaultEnabled;
		},

		setLocation: function (loc, options) {
			// Save internal reference
			this._loc = loc;

			if (this._isEnabled && this._map !== null) {
				if (this._loc === null) {
					// Anchor "marker" image to cursor
					L.DomUtil.addClass(this._map.getContainer(),
							CLASS_NO_LOCATION);
				} else {
					L.DomUtil.removeClass(this._map.getContainer(),
							CLASS_NO_LOCATION);
				}
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
					CLASS_NAME);

			this._map = map;

			// If enabled, bind map click handlers
			if (this.options.defaultEnabled) {
				this._enableControl();
			}

			// Enable/disable control if user clicks on it
			L.DomEvent.addListener(container, 'click', this._toggleEnabled, this);

			return container;
		},

		onRemove: function () {
			if (this._isEnabled) {
				this._disableControl();
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

		/**
		 * Map event listener. This listener is only active when this control is
		 * enabled. The _{un}bindMapEventHandlers methods will add and remove the
		 * listener that activates this method call.
		 *
		 * @param mouseEvent {MouseEvent}
		 */
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
			return ConfidenceCalculator.computeFromPoint(this._map.getZoom());
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
			var mapContainer = this._map.getContainer();

			L.DomUtil.addClass(this._container, CLASS_ENABLED);
			L.DomUtil.addClass(mapContainer, CLASS_LOCATION);

			if (this._loc === null) {
				L.DomUtil.addClass(mapContainer, CLASS_NO_LOCATION);
			}

			this._bindMapEventHandlers(this._map);
			this._isEnabled = true;
		},

		_disableControl: function () {
			var mapContainer = this._map ? this._map.getContainer() : null;

			L.DomUtil.removeClass(this._container, CLASS_ENABLED);
			L.DomUtil.removeClass(mapContainer, CLASS_LOCATION);

			if (L.DomUtil.hasClass(mapContainer, CLASS_NO_LOCATION)) {
				L.DomUtil.removeClass(mapContainer, CLASS_NO_LOCATION);
			}

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
