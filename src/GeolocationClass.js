/* global define*/
define([
	'mvc/Model',
	'util/Util',

	'ConfidenceCalculator'
], function (
	Model,
	Util,

	ConfidenceCalculator
) {
	'use strict';

	var DEFAULTS = {
		'location': {
			'place': null,
			'longitude': null,
			'latitude': null,
			'confidence':null,
			'accuracy': null
		}
	};

	var GeolocationClass = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};

	GeolocationClass.prototype = Object.create(Model.prototype);

	GeolocationClass.prototype.getGeolocation = function (options) {
		options = Util.extend({}, this.get(), options);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				location.latitude = position.coords.latitude;
				location.longitude = position.coords.longitude;
				location.accuracy = position.coords.accuracy;
				location.confidence =
						ConfidenceCalculator.computeFromGeolocate(location.accuracy);

				options.success(location);
			});
		} else {
			throw new Error('Geolocation Not Supported');
		}
	};

	GeolocationClass.prototype.supportsGeolocate = function () {
		return navigator.geolocation;
	};

	return GeolocationClass;
});
