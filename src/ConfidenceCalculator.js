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

			var latitudePieces = latitude.split('.');
			var longitudePieces = longitude.split('.');
			var minDecimals = Math.min(latitudePieces[1].length,
					longitudePieces[1].length);

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
		 * Given a distance in meters, compute the zoom level to zoom the map to.
		 *
		 * @params distance {number} indicates a distance in meters.
		 */

		computeZoomFromGeocode: function (distance) {
			var confidence = this.computeFromGeocode(distance);

			if (confidence === ConfidenceCalculator.HIGH_CONFIDENCE) {
				return 17;
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

			if (result.type === 'house') {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			}
			if (result.type === 'city') {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}
			if (result.type === 'postcode') {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}
			if (result.type === 'administrative') {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
			else {
				return ConfidenceCalculator.NOT_COMPUTED;
			}
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

	/**
	 * Constant used to indicate confidence was not computed or an error occurred
	 * while computing the confidence
	 */
	ConfidenceCalculator.NOT_COMPUTED = -1;


	return ConfidenceCalculator;
});
