/* global define */
define([
	'leaflet',
	'ConfidenceCalculator'
], function (
	L,
	ConfidenceCalculator
) {
	'use strict';

	var POINT_CONTROL_INPUT_METHOD = 'point';

	var CLASS_NAME = 'leaflet-point-control';
	var CLASS_ENABLED = CLASS_NAME + '-enabled';
	var CLASS_LOCATION = CLASS_NAME + '-location';

	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false,
		iconClass: CLASS_NAME + '-icon',
		helpText: 'Drop Pin'
	};

	var PointControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			options = L.Util.extend({}, DEFAULT_OPTIONS, options);
			L.Util.setOptions(this, options);

			this._isEnabled = options.defaultEnabled;
			this._marker = new L.Marker([0, 0], {draggable: true});
			this._marker.bindPopup();
			this.setLocation(options.defaultLocation);
		},

		setLocation: function (loc, options) {
			var map = this._map,
			    marker = this._marker;

			if (loc !== null) {
				// update marker
				marker.setLatLng(new L.LatLng(loc.latitude, loc.longitude));
				marker.setPopupContent(this._formatLocation(loc));
				// add marker
				if (map && !marker._map) {
					marker.addTo(map);
				}
			} else {
				// clear popup content
				marker.setPopupContent('');
				// remove marker
				if (map && marker._map) {
					map.removeLayer(marker);
				}
			}

			if (!(options && options.hasOwnProperty('silent') && options.silent)) {
				this.fire('location', loc);
			}
		},

		getLocation: function () {
			if (!this._marker._map) {
				return null;
			}
			return this._createPointLocation(this._marker.getLatLng());
		},

		onAdd: function (map) {
			var options = this.options,
			    stop = L.DomEvent.stopPropagation,
			    container,
			    toggle;

			container = document.createElement('div');
			container.classList.add(CLASS_NAME);
			container.innerHTML = [
				'<a class="', options.iconClass, '"></a>',
				'<span class="help">', options.helpText, '</span>'
			].join('');

			toggle = container.querySelector('a');

			this._map = map;
			this._container = container;
			this._toggle = toggle;

			// If enabled, bind map click handlers
			if (this.options.defaultEnabled) {
				this.enable();
			}

			// Enable/disable control if user clicks on it
			L.DomEvent.addListener(toggle, 'click', this.toggle, this);
			// stops map from zooming on double click
			L.DomEvent.addListener(container, 'dblclick', stop);
			this._marker.on('dragend', this._onDragEnd, this);

			return container;
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation,
			    container = this._container,
			    toggle = this._toggle;

			if (this._isEnabled) {
				this.disable();
			}

			L.DomEvent.removeListener(toggle, 'click', this.toggle);
			L.DomEvent.removeListener(container, 'dblclick', stop);
			this._marker.off('dragend', this._onDragEnd, this);

			this._map.removeLayer(this._marker);
			this._map = null;
			this._container = null;
			this._toggle = null;
		},

		_bindMapEventHandlers: function () {
			this._map.on('click', this._onClick, this);
			this._map.on('boxzoomstart', this._onBoxZoomStart, this);
		},

		_unbindMapEventHandlers: function () {
			this._map.off('click', this._onClick, this);
			this._map.off('boxzoomstart', this._onBoxZoomStart, this);
		},

		/**
		 * Map event listener. This listener is only active when this control is
		 * enabled. The _{un}bindMapEventHandlers methods will add and remove the
		 * listener that activates this method call.
		 *
		 * @param mouseEvent {MouseEvent}
		 */
		_onClick: function (mouseEvent) {
			if (this._boxZoomStarted === true) {
				this._boxZoomStarted = false;
				return;
			}
			this.setLocation(this._createPointLocation(mouseEvent.latlng));
		},

		_onDragEnd: function () {
			this.setLocation(this._createPointLocation(this._marker.getLatLng()));
		},

		_onBoxZoomStart: function () {
			this._boxZoomStarted = true;
		},

		_createPointLocation: function (latlng) {
			return {
				place: null,
				latitude: latlng.lat,
				longitude: latlng.lng,
				method: POINT_CONTROL_INPUT_METHOD,
				confidence: this._computeConfidence()
			};
		},

		_computeConfidence: function () {
			return ConfidenceCalculator.computeFromPoint(this._map.getZoom());
		},

		toggle: function (clickEvent) {
			if (this._isEnabled) {
				this.disable();
			} else {
				this.enable();
			}
			L.DomEvent.stop(clickEvent);
		},

		enable: function () {
			var mapContainer = this._map.getContainer();

			L.DomUtil.addClass(this._container, CLASS_ENABLED);
			L.DomUtil.addClass(mapContainer, CLASS_LOCATION);

			this._bindMapEventHandlers();
			this._isEnabled = true;
			this._boxZoomStarted = false;

			this.fire('enabled');
		},

		disable: function () {
			var mapContainer = this._map ? this._map.getContainer() : null;

			L.DomUtil.removeClass(this._container, CLASS_ENABLED);
			L.DomUtil.removeClass(mapContainer, CLASS_LOCATION);

			this._unbindMapEventHandlers();
			this._isEnabled = false;

			this.fire('disabled');
		},

		_formatLocation: function (loc) {
			var lat = loc.latitude,
			    lng = loc.longitude,
			    confidence = loc.confidence,
			    place = loc.place,
			    latStr = (lat < 0.0) ? '&deg;S' : '&deg;N',
			    lngStr = (lng < 0.0) ? '&deg;W' : '&deg;E',
			    buf = [];

			lat = ConfidenceCalculator.roundLocation(Math.abs(lat), confidence);
			lng = ConfidenceCalculator.roundLocation(Math.abs(lng), confidence);

			if (place !== null) {
				buf.push('<p>', place, '</p>');
			}
			buf.push(lat, latStr, ', ', lng, lngStr);
			return buf.join('');
		}
	});

	return PointControl;
});
