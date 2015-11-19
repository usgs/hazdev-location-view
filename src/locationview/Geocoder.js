'use strict';


var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
    Util = require('util/Util');


// Static incrementor for uniqueness
var GEOCODE_REQUEST_ID = 0;
var METHOD_GEOCODE = 'geocode';

var DEFAULTS = {
  // Forward and reverse Url should conform to ESRI API
  forwardUrl: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find',
  reverseUrl: 'http://open.mapquestapi.com/geocoding/v1/reverse'
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
      _reverseUrl,

      _buildLocationResult,
      _buildPlaceName,
      _getCallbackName;


  _this = {};

  _initialize = function (params) {
    params = Util.extend({}, DEFAULTS, params);

    _forwardUrl = params.forwardUrl;
    _reverseUrl = params.reverseUrl;
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
  _buildLocationResult = function (geocodeResponse/*, originalRequest*/) {
    var location,
        // providedLocation,
        // responseLocation,
        result;

    location = {};

    result = geocodeResponse.locations[0];

    location.METHOD = METHOD_GEOCODE;
    location.place = result.name;
    location.latitude = result.feature.geometry.y;
    location.longitude = result.feature.geometry.x;
    location.confidence = ConfidenceCalculator.computeFromGeocode(result);
    // // Just use first location for now
    // result = geocodeResponse.results[0];
    // providedLocation = result.providedLocation;
    // responseLocation = result.locations[0];

    // location.method = METHOD_GEOCODE;

    // if (providedLocation.hasOwnProperty('location')) {
    //   // forward lookup
    //   location.place = providedLocation.location;
    //   location.latitude = Number(responseLocation.latLng.lat);
    //   location.longitude = Number(responseLocation.latLng.lng);
    //   location.confidence = ConfidenceCalculator.computeFromGeocode(
    //       responseLocation);
    // } else {
    //   // reverse lookup
    //   location.place = _buildPlaceName(responseLocation);
    //   location.latitude = providedLocation.latLng.lat;
    //   location.longitude = providedLocation.latLng.lng;
    //   location.confidence = ConfidenceCalculator.computeFromCoordinates(
    //       providedLocation.latLng.lat, providedLocation.latLng.lng);
    // }



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
      location: '' + latitude + ',' + longitude
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
        request = ['outFormat=json', 'addressdetails=1'],
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

      if (!response.locations.length) {
        // Failure
        errorCallback(404, 'No location found.');
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
