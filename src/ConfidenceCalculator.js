/* global define, Math */
define([
], function (
) {
	'use strict';

	/**
	 * Utility class to get the confidence for a location.
	 * Confidence for a location is 1 to 5.
	 */
	var ConfidenceCalculator = {

		/**
		 * Compute Confidence given latitude and longitude. Latitude and longitude
		 * must be strings to keep accuracy.
		 * Confidence is based on the number of digits past the decimal.
		 *
		 * @params latititude {String}
		 * @params longitude {String}
		 *
		 */
		computeFromCoordinates: function (latitude, longitude) {
			if (typeof latitude !== 'string' || typeof longitude !== 'string') {
				return ConfidenceCalculator.NOT_COMPUTED;
			}

			var latitudePieces = latitude.split('.'),
			    longitudePieces = longitude.split('.'),
			    minDecimals;

			if (latitudePieces.length === 1 || longitudePieces.length === 1) {
				minDecimals = 0;
			} else {
				minDecimals = Math.min(latitudePieces[1].length,
						longitudePieces[1].length);
			}


			if (minDecimals >= 5) {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			} else if (minDecimals >= 4) {
				return ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE;
			} else if (minDecimals >= 3) {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			} else if (minDecimals >= 2) {
				return ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE;
			} else if (minDecimals >= 1) {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			} else if (minDecimals >= 0) {
				return ConfidenceCalculator.NO_CONFIDENCE;
			} else {
				return ConfidenceCalculator.NOT_COMPUTED;
			}

		},

		/**
		 * Compute Confidence given a zoom level.
		 * @params zoom {number} indicates the zoom level of the map.
		 */
		computeFromPoint: function (zoom) {
			if (zoom > 16) {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			} else if (zoom > 12) {
				return ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE;
			} else if (zoom > 8) {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			} else if (zoom > 4) {
				return ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE;
			} else {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
		},

		/**
		 * returns rounded value based on confidence value.
		 *
		 * @param  {string | number} value
		 *           value to be rounded
		 * @param  {number} confidence
		 *           confidence value
		 * @return {number} rounded value
		 *
		 */
		roundLocation: function (value, confidence) {
			var rounded,
			    decimals = confidence;

			if (confidence === ConfidenceCalculator.NOT_COMPUTED) {
				decimals = 0;
			}

			rounded = parseFloat(value).toFixed(decimals);
			return parseFloat(rounded);
		},

		/**
		 * Compute zoom level given a confidence.
		 * @params confidence {number} indicates the confidence level
		 */
		computeZoomFromConfidence: function (confidence) {
			if (confidence === ConfidenceCalculator.HIGH_CONFIDENCE) {
				return 16;
			} else if( confidence === ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE) {
				return 13;
			} else if( confidence === ConfidenceCalculator.AVERAGE_CONFIDENCE) {
				return 9;
			} else if( confidence === ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE) {
				return 5;
			} else if( confidence === ConfidenceCalculator.LOW_CONFIDENCE) {
				return 1;
			} else {
				return 1;
			}
		},


		computeZoomFromGeocode: function (result) {
			var confidence = this.computeFromGeocode(result);
			return this.computeZoomFromConfidence(confidence);
		},


		/**
		 * Compute Confidence given a accuracy in meters.
		 * used by GeoLocate.
		 * @params accuracy {number} indicates the accuracy in meters at 95%
		 *         confidence.
		 */
		computeFromGeolocate: function (accuracy) {
			if (accuracy > 100000) {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			} else if (accuracy > 10000) {
				return ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE;
			} else if (accuracy > 1000) {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			} else if (accuracy > 100) {
				return ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE;
			} else {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			}
		},

		/**
		 * Compute Confidence given a geocode result.
		 *
		 * @params result {object}
		 *      result is a mapquest response via the nominatim api.
		 *
		 * @see http://open.mapquestapi.com/nominatim/
		 */
		computeFromGeocode: function (result) {
			var boundingbox = result.boundingbox,
			    latSpan = Math.abs(boundingbox[1] - boundingbox[0]),
			    lonSpan = Math.abs(boundingbox[3] - boundingbox[2]),
			    maxSpan = Math.max(latSpan, lonSpan),
			    maxSpanMeters = maxSpan * 111120; // convert to meters

			// Set to average confidence, postal codes return 11m bounding boxes
			if (result.type === 'postcode') {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}

			return this.computeFromGeolocate(maxSpanMeters);

		}

	};

	// ----------------------------------------------------------------------
	// Public Static Variables
	// ----------------------------------------------------------------------

	/** Constant used to indicate high degree of confidence. */
	ConfidenceCalculator.HIGH_CONFIDENCE = 5;

	/** Constant used to indicate above average confidence. */
	ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE = 4;

	/** Constant used to indicate moderate degree of confidence. */
	ConfidenceCalculator.AVERAGE_CONFIDENCE = 3;

	/** Constant used to indicate below average confidence. */
	ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE = 2;

	/** Constant used to indicate low degree of confidence. */
	ConfidenceCalculator.LOW_CONFIDENCE = 1;

	/** Constant used to indicate very low degree of confidence. */
	ConfidenceCalculator.NO_CONFIDENCE = 0;

	/**
	 * Constant used to indicate confidence was not computed or an error occurred
	 * while computing the confidence
	 */
	ConfidenceCalculator.NOT_COMPUTED = -1;


	return ConfidenceCalculator;
});
