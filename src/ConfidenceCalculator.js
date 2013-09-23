/* global define */
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
		 * Compute Confidence given latitude and longitude.
		 * @params latititude {string}
		 * @params longitude {string}
		 * latitude and longitude must be strings to keep accuracy.
		 */
		'computeFromCoordinates' : function (latitude, longitude) {
			if( typeof latitude !== 'string' || typeof longitude !== 'string') {
				return ConfidenceCalculator.NOT_COMPUTED;
			}
			var latitudePieces = latitude.split('.');
			var longitudePieces = longitude.split('.');
			var latitudeDecimals = latitudePieces[1].length;
			var longitudeDecimals = longitudePieces[1].length;

			if( latitudeDecimals >= 5 && longitudeDecimals >= 5) {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			}
			else if( latitudeDecimals >= 4 && longitudeDecimals >= 4) {
				return ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE;
			}
			else if( latitudeDecimals >= 3 && longitudeDecimals >= 3) {
				return ConfidenceCalculator.AVERAGE_CONFIDENCE;
			}
			else if( latitudeDecimals >= 2 && longitudeDecimals >= 2) {
				return ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE;
			}
			else if( latitudeDecimals >= 1 && longitudeDecimals >= 1) {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
			else {
				return ConfidenceCalculator.NOT_COMPUTED;
			}

		},
		/**
		 * Compute Confidence given a zoom level.
		 * @params zoom {number} indicates the zoom level of the map.
		 */
		'computeFromPoint' : function ( zoom ) {
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
		/**
		 * Compute Confidence given a geocode result.
		 * @params result {string}
		 * Any result other then 'house' returns low confidence.
		 */
		'computeFromGeocode' : function (result) {
			if(result === 'house') {
				return ConfidenceCalculator.HIGH_CONFIDENCE;
			} else {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
		},

	};

// ----------------------------------------------------------------------
// Public Static Variables
// ----------------------------------------------------------------------

/** Constant used to indicate high degree of confidence. */
ConfidenceCalculator.HIGH_CONFIDENCE =  5;
    
/** Constant used to indicate above average confidence. */
ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE =  4;

/** Constant used to indicate moderate degree of confidence. */
ConfidenceCalculator.AVERAGE_CONFIDENCE =  3;

/** Constant used to indicate below average confidence. */
ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE  =  2;

/** Constant used to indicate low degree of confidence. */
ConfidenceCalculator.LOW_CONFIDENCE  =  1;

/**
 * Constant used to indicate confidence was not computed or an error occurred
 * while computing the confidence
 */
ConfidenceCalculator.NOT_COMPUTED   = -1;


	return ConfidenceCalculator;
});
