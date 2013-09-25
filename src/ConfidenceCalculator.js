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
			} else if (zoom > 14) {
				return ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE;
			} else if (zoom > 12) {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			} else if (zoom > 9) {
				return ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE;
			} else {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
		},

		computeZoomFromGeocode: function (result) {
			var confidence = this.computeFromGeocode(result);

			if (confidence === ConfidenceCalculator.HIGH_CONFIDENCE) {
				return 17;
			} else if( confidence === ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE) {
				return 15;
			} else if( confidence === ConfidenceCalculator.AVERAGE_CONFIDENCE) {
				return 13;
			} else if( confidence === ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE) {
				return 10;
			} else if( confidence === ConfidenceCalculator.LOW_CONFIDENCE) {
				return 8;
			} else {
				return 6;
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

			if (result[0].type === 'house') {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			}
			if (result[0].type === 'city') {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}
			if (result[0].type === 'postcode') {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}
			if (result[0].type === 'administrative') {
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
