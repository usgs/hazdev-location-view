'use strict';


var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
    Util = require('util/Util');


// Static incrementor for uniqueness
var GEOCODE_REQUEST_ID = 0;
var METHOD_GEOCODE = 'geocode';

// Forward and reverse Url should conform to ESRI API
var DEFAULTS = {
  // API endpoint for forward geocode searches
  forwardUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find',

   // Radial distance in meters for revserse geocode searches
  reverseRadius: 5000,

  // API endpoint for reverse geocode searches
  reverseUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode',
};


/**
 * Creates a new geocoder object.
 *
 * @param options {Object}
 *      Configuration options. See DEFAULTS for details.
 *      {forwardUrl} and/or {reverseUrl}.
 */
var Geocoder = function (params) {
  var _this,
      _initialize,

      _forwardUrl,
      _reverseRadius,
      _reverseUrl,

      _buildLocationResult,
      _buildPlaceName,
      _getCallbackName;


  _this = {};

  _initialize = function (params) {
    params = Util.extend({}, DEFAULTS, params);

    _forwardUrl = params.forwardUrl;
    _reverseUrl = params.reverseUrl;
    _reverseRadius = params.reverseRadius;
  };


  /**
   * Private static method.
   *
   * Creates a {location} object from the given {geocodeResponse} and
   * {originalRequest}.
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
  _buildLocationResult = function (geocodeResponse, originalRequest) {
    var location,
        providedLocation,
        result;

    location = {
      method: METHOD_GEOCODE,
      place: null,
      latitude: null,
      longitude: null,
      confidence: null
    };

    if (originalRequest.location) {
      // reverse lookup
      result = geocodeResponse.address;
      providedLocation = originalRequest.location.split(',');

      location.place = result.Match_addr;
      location.latitude = geocodeResponse.location.y;
      location.longitude = geocodeResponse.location.x;
      location.confidence = ConfidenceCalculator.computeFromCoordinates(
          providedLocation[1], providedLocation[0]);
    } else {
      // forward lookup
      result = geocodeResponse.locations[0];

      location.place = originalRequest.text || result.name;
      location.latitude = result.feature.geometry.y;
      location.longitude = result.feature.geometry.x;
      location.confidence = ConfidenceCalculator.computeFromGeocode(result);
    }

    return location;
  };

  /**
   *
   * @param responseLocation {Object}
   *      A location object returned from the geocoding api
   *
   * @return {String}
   *      A placename
   */
  _buildPlaceName = function (responseLocation) {
    var placename;

    placename = [];

    if (responseLocation.street) {
      placename.push(responseLocation.street);
    }

    if (responseLocation.adminArea5) {
      placename.push(responseLocation.adminArea5);
    }

    if (responseLocation.adminArea3) {
      placename.push(responseLocation.adminArea3);
    }

    if (responseLocation.postalCode) {
      placename.push(responseLocation.postalCode);
    }

    return placename.join(', ');
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
  _getCallbackName = function () {
    var callback = 'geocode_' + (new Date()).getTime() + '_' +
        GEOCODE_REQUEST_ID;

    GEOCODE_REQUEST_ID += 1;
    return callback;
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
  _this.forward = _this.geocode = function (addressString, successCallback,
      errorCallback) {
    var request = {
      text: addressString
    };

    _this.submitRequest(request, _forwardUrl, successCallback, errorCallback);
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
  _this.reverse = _this.reverseGeocode = function (latitude, longitude,
      successCallback, errorCallback) {
    var request = {
      location: '' + longitude + ',' + latitude,
      distance: _reverseRadius
    };

    _this.submitRequest(request, _reverseUrl, successCallback, errorCallback);
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
  _this.submitRequest = function (params, url, successCallback, errorCallback) {

    var script = document.createElement('script'),
        insertAt = document.querySelector('script'),
        request = ['f=pjson'],
        callbackName = _getCallbackName(),
        key = null, cleanup = null, cleanedUp = false;


    request.push('callback=' + callbackName);
    request.push('f=pjson');

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
      var error;

      if (( // failed forward lookup
            !response.hasOwnProperty('locations') ||
            response.locations.length === 0
          ) &&
          // failed reverse lookup
          !response.hasOwnProperty('address')) {    // failed reverse lookup
        error = response.error || {};

        // Failure
        errorCallback(error.code || 404,
            (error.details && error.details.length) ? error.details[0] :
                error.message || 'No location found.');
      } else {
        // Success I guess...
        successCallback(_buildLocationResult(response, params));
        cleanup();
      }

    };

    // fire off the JSONP request
    script.src = url + '?' + request.join('&');
    script.onLoad = cleanup;
    script.onError = cleanup;
    insertAt.parentNode.insertBefore(script, insertAt);
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Geocoder;
