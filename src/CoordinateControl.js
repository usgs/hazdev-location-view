/* global define */
define([
	'leaflet',
	'ConfidenceCalculator'
], function (
	L,
	ConfidenceCalculator
) {
	'use strict';

	var CLASS_NAME = 'leaflet-coordinate-control',
	    CLASS_INPUT = CLASS_NAME + '-input',
	    CLASS_ENABLED = CLASS_NAME + '-enabled';

	var METHOD = 'coordinate';

	var DEFAULTS = {
		'position': 'topleft',
		'defaultEnabled': false,
		'iconClass': CLASS_NAME + '-icon',
		'helpText': 'Enter Coordinates',
		'infoText': '<b>Enter coordinates</b>, latitude and longitude.'
	};

	var CoordinateControl =  L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
		},

		onAdd: function (map) {
			var options = this.options,
			    stop = L.DomEvent.stopPropagation,
			    container,
			    toggle,
			    control;

			container = document.createElement('div');
			container.classList.add(CLASS_NAME);
			container.innerHTML = [
				'<a class="', options.iconClass, '"></a>',
				'<span class="help">', options.helpText, '</span>',
				'<div class="', CLASS_INPUT, '">',
					'<input name="latitude" title="latitude" class="latitude"',
							'placeholder="Latitude" />',
					'<input name="longitude" title="longitude" class="longitude"',
							'placeholder="Longitude" />',
					'<button class="coordinate-submit">Search</button>',
				'</div>'
			].join('');

			toggle = container.querySelector('a');
			control = container.querySelector('.' + CLASS_INPUT);

			this._container = container;
			this._toggle = toggle;
			this._control = control;
			this._latitude = control.querySelector('.latitude');
			this._longitude = control.querySelector('.longitude');
			this._submit = control.querySelector('.coordinate-submit');
			this._map = map;

			if (this.options.defaultEnabled) {
				this.enable();
			}

			L.DomEvent.on(toggle, 'click', this.toggle, this);
			// Bind to a submit button click
			L.DomEvent.on(this._submit, 'click', this._onSubmit, this);
			// Bind event for the "enter" key
			L.DomEvent.on(control, 'keypress', this._onKeyPress, this);
			// stops map from zooming on double click
			L.DomEvent.on(container, 'dblclick', stop);

			return container;
		},

		toggle: function () {
			// if options is not defined, then toggle the control
			if (L.DomUtil.hasClass(this._container, CLASS_ENABLED)) {
				this.disable();
			} else {
				this.enable();
			}
		},

		enable: function () {
			L.DomUtil.addClass(this._container, CLASS_ENABLED);
			this._latitude.focus();

			this.fire('enabled');
		},

		disable: function () {
			L.DomUtil.removeClass(this._container, CLASS_ENABLED);

			this.fire('disabled');
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation,
			    container = this._container,
			    toggle = this._toggle,
			    control = this._control;

			L.DomEvent.removeListener(toggle, 'click', this.toggle);
			L.DomEvent.removeListener(this._submit, 'click', this._onSubmit);
			L.DomEvent.removeListener(control, 'keypress', this._onKeyPress);
			L.DomEvent.removeListener(container, 'dblclick', stop);

			this._map = null;
			this._control = null;
			this._toggle = null;
			this._container = null;
			this._latitude = null;
			this._longitude = null;
			this._submit = null;
		},

		setLocation: function (location, options) {
			if (location === null) {
				// reset location
				this._latitude.value = '';
				this._longitude.value = '';
			} else {
				// update lat/lon inputs
				this._latitude.value = ConfidenceCalculator.
						roundLocation(location.latitude, location.confidence);
				this._longitude.value = ConfidenceCalculator.
						roundLocation(location.longitude, location.confidence);
			}
			if (!(options && options.silent)) {
				this.fire('location', location);
			}
		},

		_onSubmit: function () {
			var latitude = this._latitude.value,
			    longitude = this._longitude.value,
			    location = this._getCoordinateLocation(latitude, longitude);

			// fire a location change
			this.setLocation(location);
		},

		_getCoordinateLocation: function (latitude, longitude) {
			var confidence = ConfidenceCalculator.
							computeFromCoordinates(latitude, longitude);

			return {
				'place': null,
				'longitude': parseFloat(longitude),
				'latitude': parseFloat(latitude),
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
