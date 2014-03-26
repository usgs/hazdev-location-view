/* global define */
define([
	'leaflet',
	'util/Util',

	'ConfidenceCalculator'
], function (
	L,
	Util,

	ConfidenceCalculator
) {
	'use strict';

	var CLASS_NAME = 'leaflet-geolocation-control';

	var DEFAULTS = {
		'geolocation': navigator.geolocation,
		'position': 'topleft',
		'iconClass': 'leaflet-geolocation-control-icon',
		'helpText': 'Use Current Location',
		'infoText': 'Attempt to automatically locate my <b>current location</b>.'
	};

	var METHOD = 'geolocation';


	/**
	 * @params geolocation {object} optional api to replace navigator.geolocation
	 *         should have a getCurrentPosition call.
	 */
	var GeolocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this._geolocateSuccess = this._geolocateSuccess.bind(this);
			this._geolocateError = this._geolocateError.bind(this);
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

			L.DomEvent.addListener(toggle, 'click', this.toggle, this);
			// stops map from zooming on double click
			L.DomEvent.addListener(container, 'dblclick', stop);

			return container;
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation,
			    container = this._container,
			    toggle = this._toggle;

			L.DomEvent.removeListener(toggle, 'click', this.toggle);
			L.DomEvent.removeListener(container, 'dblclick', stop);

			this._container = null;
			this._toggle = null;
			this._map = null;
		},

		doGeolocate: function () {
			var geolocation = this.options.geolocation;
			if (geolocation) {
				geolocation.getCurrentPosition(this._geolocateSuccess,
					this._geolocateError);
			} else {
				this._geolocateError({
					code: 0,
					message: 'Geolocation not supported'
				});
			}

			this.fire('enabled');
		},

		_geolocateSuccess: function (position) {
			this.setLocation({
					place: null,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					method: METHOD,
					confidence: ConfidenceCalculator.computeFromGeolocate(
						position.coords.accuracy)
			});
		},

		_geolocateError: function (error) {
			this.fire('locationError', error);
		},

		setLocation: function (location, options) {
			// API method, this control has nothing to do
			if (!(options && options.silent)) {
				this.fire('location', location);
			}
		},

		toggle: function (clickEvent) {
			this.enable();
			L.DomEvent.stop(clickEvent);
		},

		enable: function () {
			this.doGeolocate();
		},

		disable: function () {
			// API method, this control has nothing to do
		}

	});


	GeolocationControl.METHOD = METHOD;


	return GeolocationControl;
});
