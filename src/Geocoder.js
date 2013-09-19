/* global define */
define([
], function (
) {
	'use strict';

	// Static incrementor for uniqueness
	var GEOCODE_REQUEST_ID = 0;
	// Webservice URL for forward geocode requests
	var FORWARD_URL = 'http://www.mapquestapi.com/geocoding/v1/address';
	// Webservice URL for reverse geocode requests
	var REVERSE_URL = 'http://open.mapquestapi.com/geocoding/v1/reverse';

	/**
	 * Creates a new geocoder object.
	 *
	 * @param options {Object}
	 *      Configuration options. Must specify {apiKey}. May specify
	 *      {forwardUrl} and/or {reverseUrl}.
	 */
	var Geocoder = function (options) {
		this._apiKey = options.apiKey;
		this._forwardUrl = options.forwardUrl || FORWARD_URL;
		this._reverseUrl = options.reverseUrl || REVERSE_URL;
	};

	/**
	 * Performs asynchronous forward geocode requests.
	 *
	 * @param addressString {String}
	 *      The address string to geocode.
	 * @param successCallback {Function}
	 *      The callback method to execute on success. This callback should expect
	 *      a {location} object as its singal parameter.
	 * @param errorCallback {Function}
	 *      The callback method to execute on error. This callback should expect
	 *      {statusCode} and {statusMessage} parameters.
	 */
	Geocoder.prototype.forward = function (addressString, successCallback,
			errorCallback) {
		var request = {
			location: addressString
		};

		this._submitRequest(request, this._forwardUrl, successCallback,
				errorCallback);
	};

		/**
	 * Performs asynchronous reverse geocode requests.
	 *
	 * @param latitude {Number}
	 *      The latitude of the coordinate to reverse geocode.
	 * @param longitude {Number}
	 *      The longitude of the coordinate to reverse geocode.
	 * @param successCallback {Function}
	 *      The callback method to execute on success. This callback should expect
	 *      a {location} object as its singal parameter.
	 * @param errorCallback {Function}
	 *      The callback method to execute on error. This callback should expect
	 *      {statusCode} and {statusMessage} parameters.
	 */
	Geocoder.prototype.reverse = function (latitude, longitude, successCallback,
			errorCallback) {
		var request = {
			lat: latitude,
			lng: longitude
		};

		this._submitRequest(request, this._reverseUrl, successCallback,
				errorCallback);
	};

	/**
	 * Private method.
	 *
	 * Executes the JSONP request. Called internally by {forward} and {reverse}
	 * methods.
	 *
	 * @param params {Object}
	 *      Parameters for the request.
	 * @param url {String}
	 *      The webservice URL against which to perform the request.
	 * @param successCallback {Function}
	 *      The callback method to execute on success. This callback should expect
	 *      a {location} object as its singal parameter.
	 * @param errorCallback {Function}
	 *      The callback method to execute on error. This callback should expect
	 *      {statusCode} and {statusMessage} parameters.
	 */
	Geocoder.prototype._submitRequest = function (params, url, successCallback,
			errorCallback) {

		var script = document.createElement('script'),
		    insertAt = document.querySelector('script'),
		    request = [url, '?key=', this._apiKey],
		    callbackName = _getCallbackName(),
		    key = null, cleanup = null, cleanedUp = false;

		// build up the full request URL based on the input parameters
		for (key in params) {
			request.push(key + '=' + params[key]);
		}

		// callback method used to clean up memory following the JSONP response
		cleanup = function () {
			if (cleanedUp) {
				return;
			}

			window[callbackName] = null;
			delete window[callbackName];

			script.parentNode.removeChild(script);
			script = null;

			cleanedUp = true;
		};

		// JSONP callback method (attached to global window)
		window[callbackName] = function (response) {
			response = response[0]; // Use first response?

			if (response.info.statuscode !== 0) {
				// API error
				errorCallback(response.info.statuscode, 'Request failed.');
			} else if (response.location.length === 0) {
				// No results error
				errorCallback(404, 'No location found.');
			} else {
				// Success I guess...
				successCallback(_buildLocationResult(response.locations, params));
				cleanup();
			}
		};

		// fire off the JSONP request
		script.src = request.join('');
		script.onLoad = cleanup;
		script.onError = cleanup;
		insertAt.parentNode.insertBefore(script, insertAt);
	};

	/**
	 * Private static method.
	 *
	 * Creates a {location} object from the given {geocodeResponse} and {originalRequest}.
	 *
	 * @param geocodeResponse {Object}
	 *      The first location object returned by the JSONP request.
	 * @param originalRequest {Object}
	 *      The parameters used to create the original JSONP request.
	 *
	 * @return {Object}
	 *      A location object for use with LocationView and LocationControl
	 *      components.
	 */
	var _buildLocationResult = function (geocodeResponse, originalRequest) {
		var location = {};

		if (originalRequest.hasOwnProperty('location')) {
			// forward lookup
			location.place = originalRequest.location;
			location.latitude = geocodeResponse.latLng.lat;
			location.longitude = geocodeResponse.latLng.lng;
		} else {
			// reverse lookup
			location.place = _parseLocationPlace(geocodeResponse);
			location.latitude = originalRequest.latitude;
			location.longitude = originalRequest.longitude;
		}

		location.confidence = _computeLocationConfidence(geocodeResponse);
		location.accuracy = null; // TODO

		return location;
	};

	/**
	 * Private static method.
	 *
	 * Parses the canonical administrative region (and street) information out of
	 * the given geocodeResponse object.
	 *
	 * @param geocodeResponse {Object}
	 *      The response from which to parse place-string information.
	 *
	 * @return {String}
	 *      A canonical "place" for the geocodeResponse.
	 */
	var _parseLocationPlace = function (geocodeResponse) {
		var i = 1, place = [];

		for (i = 0; i < 6; i++) {
			if (_hasValue(geocodeResponse, 'adminArea'+i)) {
				place.push(geocodeResponse['adminArea'+i]);
			}
		}

		if (_hasValue(geocodeResponse, 'street')) {
			place.push(geocodeResponse.street);
		}

		return place.reverse().join(', ');
	};

	/**
	 * Private static method.
	 *
	 * @param geocodeResponse {Object}
	 *      The geocode response for which to compute the confidence.
	 *
	 * @return {String}
	 *      The qualitative confidence value to be placed on the given response.
	 */
	var _computeLocationConfidence = function ( /*geocodeResponse*/ ) {
		// TODO :: Use a confidence calculator
		//CALCULATOR.computeFromGeocode(geocodeResponse);
		return 'FooConfidence';
	};

	/**
	 * Private static method.
	 *
	 * Determines if the given {obj} as a non-empty {val} property set.
	 *
	 * @param obj {Object}
	 *      The object for which to check for {val}.
	 * @param val {String}
	 *      The property to check on the given {obj}.
	 *
	 * @return {Boolean}
	 *      True if the object has a property named {val} that is non-empty, false
	 *      otherwise.
	 */
	var _hasValue = function (obj, val) {
		return (
			obj.hasOwnProperty(val) &&
			typeof obj[val] !== 'undefined' &&
			obj[val] !== null);
	};

	/**
	 * Private static method.
	 *
	 * Computes a unique string suitable for use in creating a new global
	 * callback method.
	 *
	 * @return {String}
	 *      A unique string.
	 */
	var _getCallbackName = function () {
		var callback = 'geocode_' + (new Date()).getTime() + '_' +
				GEOCODE_REQUEST_ID;

		GEOCODE_REQUEST_ID += 1;
		return callback;
	};

	// -- Canonical helpers to expose a more human-readible API -- //
	Geocoder.prototype.geocode = Geocoder.prototype.forward;
	Geocoder.prototype.reverseGeocode = Geocoder.prototype.reverse;

	return Geocoder;
});
