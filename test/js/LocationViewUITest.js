/* global require */
require([
	'LocationView'
], function (
	LocationView
) {
	'use strict';

	var _showLocationButton = document.querySelector('#showLocationView'),
	    _locationResult = document.querySelector('#locationResult'),
	    _onLocationCallback,
	    locationView;

	locationView = new LocationView({
		onLocationCallback: _onLocationCallback
	});

	// Open location view when button is clicked
	_showLocationButton.addEventListener('click', function () {
		locationView.show();
	});

	_onLocationCallback = function (loc) {
		var description = '';

		if (loc.hasOwnProperty('description')) {
			description = loc.description;
		}

		_locationResult.innerHTML = [
			'Latitude: ', loc.latitude, '<br/>',
			'Longitude: ', loc.longitude, '<br/>',
			'Precision: ', loc.precision, '<br/>',
			description
		].join('');
	};

	locationView.show();
});
