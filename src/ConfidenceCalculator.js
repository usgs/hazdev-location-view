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
		 * Compute Confidence given latitude and longitude.
		 * @params latititude {string}
		 * @params longitude {string}
		 * latitude and longitude must be strings to keep accuracy.
		 */
		computeFromCoordinates: function (latitude, longitude) {
			if( typeof latitude !== 'string' || typeof longitude !== 'string') {
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
		/**
		 * Compute confidence given granularity value and confidence.
		 * @params originalvalue {Number} 1-5
		 * @params confidence {char} A,B,C,X
		 */
		_calculateMapQuestConfidence: function(originalvalue, confidence) {
			//if X return NOT_COMPUTED.
			if (confidence === 'X') {
				return ConfidenceCalculator.NOT_COMPUTED;
			// if a grade, subtract 0,1,2 never return less then a 1
			} else if (confidence === 'A') {
				return originalvalue;
			} else if (confidence === 'B') {
				return ((originalvalue - 1)) > 1 ? (originalvalue - 1) : 1;
			} else if (confidence === 'C') {
				return ((originalvalue - 2) > 1) ? (originalvalue -2) : 1;
			}
		},
		/**
		 * Compute Confidence given a geocode result.
		 * @params result {object}
		 * result is a standard mapquest 'Geocode Response'.
		 * www.mapquestapi.com/geocoding
		 * www.mapquestapi.com/geocoding/geocodequality.html#granularity
		 */
		computeFromGeocode: function (result) {
			var geocodeQualityCode = result.results[0].locations[0].geocodeQualityCode;
			var granularity = geocodeQualityCode.substr(0,2);
			var fullStreetConfidence = geocodeQualityCode.substr(2,1);
			var adminConfidence = geocodeQualityCode.substr(3,1);
			var postalConfidence = geocodeQualityCode.substr(4,1);

			if (granularity === 'P1' || granularity === 'L1' ||
				  granularity === 'I1' || granularity === 'B1') {
				return this._calculateMapQuestConfidence(
					ConfidenceCalculator.HIGH_CONFIDENCE, fullStreetConfidence);
			} else if (granularity === 'B2' || granularity === 'B3') {
				return this._calculateMapQuestConfidence(
					ConfidenceCalculator.ABOVE_AVERAGE_CONFIDENCE, fullStreetConfidence);
			} else if (granularity === 'A5') {
				return this._calculateMapQuestConfidence(
					ConfidenceCalculator.AVERAGE_CONFIDENCE, adminConfidence);
			} else if (granularity === 'Z1' || granularity === 'Z2' ||
					 granularity === 'Z3' || granularity === 'Z4') {
				return this._calculateMapQuestConfidence(
					ConfidenceCalculator.AVERAGE_CONFIDENCE, postalConfidence);
			} else if (granularity === 'A4' || granularity === 'A3') {
				return this._calculateMapQuestConfidence(
					ConfidenceCalculator.BELOW_AVERAGE_CONFIDENCE, adminConfidence);
			} else {
				return ConfidenceCalculator.LOW_CONFIDENCE;
			}
		},

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
