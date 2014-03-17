/* global define */
define([
	'leaflet',

	'ConfidenceCalculator'
], function (
	L,

	ConfidenceCalculator
) {
	'use strict';

	var DEFAULTS = {
		'location': {
			'longitude': null,
			'latitude': null,
			'confidence':null,
			'accuracy': null
		},
		'position': 'topleft'
	};
	var _this;

	var GeolocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this.location = this.options.location;
		},

		onAdd: function (map) {
			this._map = map;

			var container = this._container =
					L.DomUtil.create('a', 'leaflet-geolocation-control');

			container.title = 'Use Current Location';

			L.DomEvent.addListener(container, 'click', this.getGeolocate, this);

			return container;
		},

		getGeolocate: function () {
			_this = this;
			if( !this.supportsGeolocate()) {
				this._geolocateError({'code':0,'message':'Geolocation not supported'});
			}
			this.callGeolocate();
		},

		callGeolocate: function () {
			navigator.geolocation.getCurrentPosition(
				this._geolocateSuccess, this._geolocateError);
		},

		supportsGeolocate: function () {
			if (navigator.geolocation) {
				return true;
			}
			else{
				return false;
			}
		},

		_geolocateSuccess: function (position) {
			var location = _this.options.location;
			location.latitude = position.coords.latitude;
			location.longitude = position.coords.longitude;
			location.accuracy = position.coords.accuracy;
			location.confidence =
					ConfidenceCalculator.computeFromGeolocate(
						location.accuracy);

			if (location.latitude !== null &&
					location.longitude !== null) {
				_this.fire('location', location);
			}
		},

		_geolocateError: function (error) {
			_this.fire('locationError', {'statusCode':error.code,
				'statusMessage':error.message});
		}

	});

	return GeolocationControl;
});
