/* global define */
define([
	'leaflet',
	'ConfidenceCalculator'
], function (
	L,
	ConfidenceCalculator
) {
	'use strict';

	var METHOD = 'coordinate';

	var DEFAULTS = {
		'position': 'topleft',
		'defaultEnabled': false
	};

	var CoordinateControl =  L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
		},

		onAdd: function (map) {
			var container = this._container = L.DomUtil.create('div',
							'leaflet-coordinate-control-wrapper'),
			    toggle = this._toggle = L.DomUtil.create('a',
							'leaflet-coordinate-control-toggle'),
			    control = this._control = L.DomUtil.create('div',
							'leaflet-coordinate-control-input'),
			    stop = L.DomEvent.stopPropagation;

			this._map = map;
			container.appendChild(toggle);
			container.appendChild(control);

			control.title = 'Location Using Latitude/ Longitude';
			control.innerHTML = [
					'<input name="latitude" title="latitude" class="latitude"',
							'placeholder="Latitude" />',
					'<input name="longitude" title="longitude" class="longitude"',
							'placeholder="Longitude" />',
					'<button class="coordinate-submit">Search</button>',
			].join('');

			this._latitude = control.querySelector('.latitude');
			this._longitude = control.querySelector('.longitude');
			this._submit = control.querySelector('.coordinate-submit');

			if (this.options.defaultEnabled) {
				this.toggle({'enabled': true});
			}

			L.DomEvent.on(this._toggle, 'click', this.toggle, this);

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

		toggle: function (options) {
			// allow options to always open or always close coordinate control
			if (options.hasOwnProperty('enabled')) {
				if (options.enabled === true) {
					// force an open state
					L.DomUtil.addClass(this._container, 'enabled');
				} else {
					// force a closed state
					L.DomUtil.removeClass(this._container, 'enabled');
				}
				return;
			}

			// if options is not defined, then toggle the control
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

		setLocation: function (location) {
			if (location === null) {
				// reset location
				this._location = {};
			} else {
				this._location = location;
			}
		},

		getLocation: function () {
			return this._location;
		},

		_onSubmit: function () {
			var latitude = this._latitude.value,
			    longitude = this._longitude.value,
			    location = this._getCoordinateLocation(latitude, longitude);

			// fire a location change
			this.fire('location', location);
		},

		_getCoordinateLocation: function (latitude, longitude) {
			var confidence = ConfidenceCalculator.
							computeFromCoordinates(latitude, longitude);

			// round values based on confidence
			this._latitude.value = latitude = Number(latitude).toFixed(confidence);
			this._longitude.value = longitude = Number(longitude).toFixed(confidence);

			return {
				'placeString': null,
				'longitude': longitude,
				'latitude': latitude,
				'method': METHOD,
				'confidence': confidence
			};
		},

		_onKeyPress: function (keyPress) {
			if(keyPress.keyCode === 13) {
				this._onSubmit();
			}
		}

	});

	// expose the coordinate control method type
	CoordinateControl.METHOD = METHOD;

	return CoordinateControl;

});
