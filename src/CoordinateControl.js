/* global define */
define([
	'leaflet',
	'ConfidenceCalculator'
], function (
	L,
	ConfidenceCalculator
) {
	'use strict';

	var getCoordinateControlMethod = function () {
		return 'coordinate-control';
	};

	var DEFAULTS = {
		'location': {
			'place': null,
			'longitude': 0,
			'latitude': 0,
			'method': getCoordinateControlMethod(),
			'confidence':null,
			'accuracy': null
		},
		'position': 'topleft',
		'defaultEnabled': false
	};

	var CoordinateControl =  L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this._location = this.options.location || null;
		},

		onAdd: function (map) {

			this._map = map;

			var container = this._container = L.DomUtil.create('div',
							'leaflet-coordinate-control-wrapper'),
			    toggle = this._toggle = L.DomUtil.create('a',
							'leaflet-coordinate-control-toggle'),
			    control = this._control = L.DomUtil.create('div',
							'leaflet-coordinate-control-input'),
			    stop = L.DomEvent.stopPropagation;

			container.appendChild(toggle);
			container.appendChild(control);

			control.title = 'Location Using Latitude/ Longitude';
			control.innerHTML = [
					'<input name="latitude" title="latitude" id="latitude"',
							'placeholder="Latitude" />',
					'<input name="longitude" title="longitude" id="longitude"',
							'placeholder="Longitude" />',
					'<button id="coordinate-submit">Search</button>',
			].join('');

			this._latitude = control.querySelector('#latitude');
			this._longitude = control.querySelector('#longitude');
			this._submit = control.querySelector('#coordinate-submit');

			if (this.options.defaultEnabled) {
				this._toggleInput();
			}

			L.DomEvent.on(this._toggle, 'click', this._toggleInput, this);

			// Bind to a submit button click
			L.DomEvent.on(this._submit, 'click', this._onSubmit, this);
			// Bind event for the "enter" key
			L.DomEvent.on(this._control, 'keypress', this._onKeyPress, this);

			L.DomEvent.on(this._control, 'dblclick', stop);
			L.DomEvent.on(this._control, 'mouseup', stop);
			L.DomEvent.on(this._control, 'mousedown', stop);
			L.DomEvent.on(this._control, 'mousemove', stop);

			return container;
		},

		_toggleInput: function () {
			if (L.DomUtil.hasClass(this._container, 'enabled')) {
				L.DomUtil.removeClass(this._container, 'enabled');
			} else {
				L.DomUtil.addClass(this._container, 'enabled');
			}
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation;

			L.DomEvent.removeListener(this._submit, 'click', this._onSubmit);
			L.DomEvent.removeListener(this._control, 'keypress', this._onKeyPress);

			L.DomEvent.off(this._control, 'dblclick', stop);
			L.DomEvent.off(this._control, 'mouseup', stop);
			L.DomEvent.off(this._control, 'mousedown', stop);
			L.DomEvent.off(this._control, 'mousemove', stop);

			this._map = null;
			this._control = null;
		},

		setLocation: function (location, options) {
			this._location = location;
			this._latitude.value = location.latitude;
			this._longitude.value = location.longitude;

			if (!(options && options.silent)) {
				this.fire('location', this._location);
			}
		},

		getLocation: function () {
			return this._location;
		},

		_onSubmit: function () {
			//TODO, capture invalid or blank inputs from lat/lon
			return this.setLocation(
					this._getCoordinateLocation(
							this._latitude.value,
							this._longitude.value
					)
			);
		},

		_onKeyPress: function (keyPress) {
			if(keyPress.keyCode === 13) {
				this._onSubmit();
			}
		},

		_getCoordinateLocation: function (latitude, longitude) {
			return {
				'place': null,
				'longitude': Number(longitude),
				'latitude': Number(latitude),
				'method': getCoordinateControlMethod(),
				'confidence': ConfidenceCalculator.
						computeFromCoordinates(latitude, longitude),
				'accuracy': null // TODO
			};
		},

		_getConfidenceLevel: function () {
			return 'confidence';
		}

	});

	// expose the coordinate control method type
	CoordinateControl.METHOD = getCoordinateControlMethod();

	return CoordinateControl;

});
