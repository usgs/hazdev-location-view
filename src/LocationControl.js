/* global define */
define([
	'leaflet',
	'util/Util',

	'PointControl',
	'CoordinateControl',
	'GeocodeControl',
	'GeolocationControl',
	'ConfidenceCalculator'
], function (
	L,
	Util,

	PointControl,
	CoordinateControl,
	GeocodeControl,
	GeolocationControl,
	ConfidenceCalculator
) {
	'use strict';

	var CLASS_NAME = 'leaflet-location-control',
	    CLASS_ENABLED = CLASS_NAME + '-enabled';


	var DEFAULTS = {
		'includeGeolocationControl':
				navigator && navigator.hasOwnProperty('geolocation'),
		'includeGeocodeControl': false,
		'includeCoordinateControl': false,
		'includePointControl': true,
		'location': null,
		'position': 'bottomleft',
		'el': null,
		'iconClass': CLASS_NAME + '-icon',
		'helpText': 'Show Location Options'
	};

	var LocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			var controls;

			options = L.Util.extend({}, DEFAULTS, options);
			L.Util.setOptions(this, options);

			this._el = this.options.el || document.body;
			this._location = this.options.location;

			controls = [];
			if (options.includeGeolocationControl) {
				controls.push(options.geolocationControl || new GeolocationControl());
			}
			if (options.includeGeocodeControl) {
				controls.push(options.geocodeControl || new GeocodeControl());
			}
			if (options.includeCoordinateControl) {
				controls.push(options.coordinateControl || new CoordinateControl());
			}
			if (options.includePointControl) {
				controls.push(options.pointControl || new PointControl());
			}
			this._controls = controls;
		},

		_eachControl: function (callback) {
			var controls = this._controls,
			    control,
			    i, len;

			for (i = 0, len = controls.length; i < len; i++) {
				control = controls[i];
				callback(control, i, controls);
			}
		},

		onAdd: function (map) {
			var options = this.options,
			    stop = L.DomEvent.stopPropagation,
			    container,
			    toggle;

			this._map = map;
			this._enabled = null;

			this._eachControl(function (control) {
				map.addControl(control);
				control.on('location', this.setLocation, this);
				control.on('locationError', this._onLocationError, this);
				control.on('enabled', this._onControlEnabled, this);
			}.bind(this));

			// Create Information Control (i) button
			container = document.createElement('div');
			container.classList.add(CLASS_NAME);
			container.innerHTML = [
				'<a class="', options.iconClass, '">i</a>',
				'<span class="help">', options.helpText, '</span>',
			].join('');
			toggle = container.querySelector('a');

			this._container = container;
			this._toggle = toggle;

			// create overlay with control information
			this._createInformationMenu();
			this._el.appendChild(this._details);


			L.DomEvent.addListener(toggle, 'click', this.toggle, this);
			L.DomEvent.addListener(container, 'click', stop);
			L.DomEvent.addListener(container, 'dblclick', stop);

			return container;
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation;

			this._eachControl(function (control) {
				this.map.removeControl(control);
				control.off('location', this.setLocation, this);
				control.off('locationError', this._onLocationError, this);
				control.off('enabled', this._onControlEnabled, this);
			}.bind(this));

			L.DomEvent.removeListener(this._toggle, 'click', this.toggle);
			L.DomEvent.removeListener(this._container, 'click', stop);
			L.DomEvent.removeListener(this._container, 'dblclick', stop);

			this._el.removeChild(this._details);
			this._details = null;
			this._container = null;
			this._toggle = null;
			this._map = null;
		},

		/**
		 * Create a help/info menu with detailed descriptions of each control
		 * 
		 * @return {[type]} [description]
		 */
		_createInformationMenu: function () {
			var stop = L.DomEvent.stopPropagation,
			    panel,
			    list;

			panel = document.createElement('div');
			panel.classList.add('information-panel');
			panel.innerHTML = '<ul class="information-list"></ul>';
			list = panel.querySelector('.information-list');

			this._eachControl(function (control, index) {
				var controlOptions = control.options,
				    controlEl = control.__infoEl;

				if (!controlEl) {
					controlEl = document.createElement('li');
					controlEl.setAttribute('data-index', index);
					controlEl.innerHTML = [
						'<span title="', controlOptions.helpText, '"',
								' class="icon ', controlOptions.iconClass, '"></span>',
						'<p>', controlOptions.infoText, '</p>'
					].join('');
					L.DomEvent.addListener(controlEl, 'click', control.enable, control);
					control.__infoEl = controlEl;
				}

				list.appendChild(controlEl);
			});

			// create div for information menu
			this._details = panel;

			// stop interaction with map when the information menu is visible
			L.DomEvent.on(panel, 'mousedown', stop);
			L.DomEvent.on(panel, 'dblclick', stop);
			L.DomEvent.on(panel, 'wheel', stop);
		},

		toggle: function () {
			if (!this._el.classList.contains(CLASS_ENABLED)) {
				this.enable();
			} else {
				this.disable();
			}
		},

		enable: function () {
			this._el.classList.add(CLASS_ENABLED);

			this.fire('enabled');
		},

		disable: function () {
			this._el.classList.remove(CLASS_ENABLED);

			this.fire('disabled');
		},

		_onControlEnabled: function (e) {
			var target = null;

			if (e) {
				target = e.target;
			}

			this._eachControl(function (control) {
				if (control !== target) {
					control.disable();
				}
			});

			if (target !== this) {
				// hide details
				this.disable();
			}
		},

		setLocation: function (location, options) {
			var zoomLevel;

			if (location) {
				location = {
					place: location.place,
					latitude: location.latitude,
					longitude: location.longitude,
					confidence: location.confidence,
					method: location.method
				};
			}

			this._location = location;
			this._eachControl(function (control) {
				control.setLocation(location, {'silent': true});
			});

			if (location) {
				zoomLevel = ConfidenceCalculator.computeZoomFromConfidence(
						location.confidence);
				// do not zoom the user out
				if (zoomLevel < this._map._zoom) {
					zoomLevel = this._map._zoom;
				}
				//center the map
				this._map.setView({
						lon: location.longitude,
						lat: location.latitude
					},
					zoomLevel
				);
			} else {
				// TODO: zoom to world?
			}

			if (!(options && options.silent)) {
				this.fire('location', location);
			}
		},

		getLocation: function () {
			return this._location;
		},

		_onLocationError: function (error) {
			// TODO, make this better
			window.alert(error.message);
		}

	});

	return LocationControl;
});
