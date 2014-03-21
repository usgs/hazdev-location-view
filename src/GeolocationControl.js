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

	var DEFAULTS = {
		'geolocation': navigator.geolocation,
		'position': 'topleft'
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
			this._map = map;

			var container = this._container =
					L.DomUtil.create('a', 'leaflet-geolocation-control'),
			    stop = L.DomEvent.stopPropagation;

			container.title = 'Use Current Location';

			L.DomEvent.addListener(container, 'click', this.doGeolocate, this);
			// stops map from zooming on double click
			L.DomEvent.on(container, 'dblclick', stop);

			return container;
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
		},

		_geolocateSuccess: function (position) {
			this.fire('location', {
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
		}

	});


	GeolocationControl.METHOD = METHOD;


	return GeolocationControl;
});
