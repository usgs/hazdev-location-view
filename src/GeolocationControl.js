/* global define */
define([
	'leaflet',

	'GeolocationClass'
], function (
	L,
	GeolocationClass
) {
	'use strict';

	var DEFAULTS = {
		'location': {
			'place': null,
			'longitude': null,
			'latitude': null,
			'confidence':null,
			'accuracy': null
		},
		'geolocation': null,
		'position': 'topleft'
	};

	var GeolocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this.location = this.options.location;
			if (this.options.geolocation === null) {
				this.options.geolocation = new GeolocationClass();
			}
		},

		onAdd: function (map) {
			this._map = map;

			var container = this._container =
					L.DomUtil.create('a', 'leaflet-geolocation-control');

			container.title = 'Use Current Location';

			L.DomEvent.addListener(container, 'click', this._onChange, this);

			return container;
		},

		_onChange: function () {
			var _this = this;
			if( !this.options.geolocation.supportsGeolocate()) {
				return;
			}
			this.options.geolocation.getGeolocation({success:function(location){
				_this.options.location.latitude = location.latitude;
				_this.options.location.longitude = location.longitude;
				_this.options.location.accuracy = location.accuracy;
				_this.options.confidence = location.confidence;
				if (_this.options.location.latitude !== null &&
						_this.options.location.longitude !==null) {
					_this.fire('location', _this.options.location);
				}
			}});
		}
	});

	return GeolocationControl;
});