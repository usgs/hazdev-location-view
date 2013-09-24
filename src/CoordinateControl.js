/* global define */
define([
	'leaflet'
], function (
	L
) {
	'use strict';

	var getCoordinateControlMethod = function () {
		return 'confidence-control';
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
		'position': 'topleft'
	};

	var CoordinateControl =  L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
			this._location = this.options.location;
		},

		onAdd: function (map) {

			this._map = map;

			var control = this._control = L.DomUtil.create('div', 'leaflet-coordinate-control'),
			    stop = L.DomEvent.stopPropagation;

			control.title = 'Location Using Latitude/ Longitude';
			control.innerHTML = [
				'<ul>',
					'<li class="latitude-list-item">',
						'<label for="latitude">Latitude:</label>',
						'<input type="number" name="latitude" id="latitude" min="-90" max="90" step="any" />',
					'</li>',
					'<li class="longitude-list-item">',
						'<label for="longitude">Longitude:</label>',
						'<input type="number" name="longitude" id="longitude" min="-360" max="360" step="any" />',
					'</li>',
					'<li>',
					'<button id="coordinate-submit">Submit</button>',
					'</li>'
			].join('');

			this._latitude = control.querySelector('#latitude');
			this._longitude = control.querySelector('#longitude');
			this._submit = control.querySelector('#coordinate-submit');

			// Bind to a submit button click
			L.DomEvent.on(this._submit, 'click', this._onSubmit, this);
			// Bind event for the "enter" key
			L.DomEvent.on(this._control, 'keypress', this._onKeyPress, this);

			L.DomEvent.on(this._control, 'dblclick', stop);
			L.DomEvent.on(this._control, 'mouseup', stop);
			L.DomEvent.on(this._control, 'mousedown', stop);
			L.DomEvent.on(this._control, 'mousemove', stop);

			return control;
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

			//TODO, capture invalid or blank inputs from lat/lon

			this._location = location;

			if (!(options && options.silent)) {
				this.fire('location', this._location);
			}
		},

		getLocation: function () {
			return this._location;
		},

		_onSubmit: function () {
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
				'confidence':this._getConfidenceLevel(), // TODO
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
