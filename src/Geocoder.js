/* global define */
define([
	'ConfidenceCalculator'
], function (
	ConfidenceCalculator
) {
	'use strict';

	// Static incrementor for uniqueness
	var GEOCODE_REQUEST_ID = 0;
	// Webservice URL for forward geocode requests
	var FORWARD_URL = 'http://open.mapquestapi.com/nominatim/v1/search.php';
	// Webservice URL for reverse geocode requests
	var REVERSE_URL = 'http://open.mapquestapi.com/nominatim/v1/reverse.php';
	var METHOD_GEOCODE = 'geocode';

	/**
	 * Creates a new geocoder object.
	 *
	 * @param options {Object}
	 *      Configuration options. Must specify {apiKey}. May specify
	 *      {forwardUrl} and/or {reverseUrl}.
	 */
	var Geocoder = function (options) {
		options = options || {};
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
			q: addressString
		};

		this._submitRequest(request, this._forwardUrl, successCallback,
				errorCallback);
	};

		/**
	 * Performs asynchronous reverse geocode requests.
	 *
	 * @param latitude {String}
	 *      The latitude of the coordinate to reverse geocode.
	 * @param longitude {String}
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
			lon: longitude
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
		    request = ['format=json', 'addressdetails=1'],
		    callbackName = _getCallbackName(),
		    key = null, cleanup = null, cleanedUp = false;


		request.push('json_callback=' + callbackName);

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

			if ((params.hasOwnProperty('q') && response.length === 0) ||
					(response.hasOwnProperty('error'))) {
				// Failure
				errorCallback(404, response.error || 'No location found.');
			} else {
				// Success I guess...
				successCallback(_buildLocationResult(
						response.length ? response[0] : response,
						params));
				cleanup();
			}

		};

		// fire off the JSONP request
		script.src = url + '?' + request.join('&');
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

		if (originalRequest.hasOwnProperty('q')) {
			// forward lookup
			location.place = originalRequest.q;
			location.latitude = Number(geocodeResponse.lat);
			location.longitude = Number(geocodeResponse.lon);
			location.method = METHOD_GEOCODE;
			location.confidence = ConfidenceCalculator.computeFromGeocode(
					geocodeResponse);
		} else {
			// reverse lookup
			location.place = geocodeResponse.display_name;
			location.latitude = originalRequest.lat;
			location.longitude = originalRequest.lon;
			location.method = METHOD_GEOCODE;
			location.confidence = ConfidenceCalculator.computeFromCoordinates(
					originalRequest.latitude, originalRequest.longitude);
		}

		return location;
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
