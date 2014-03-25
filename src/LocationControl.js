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

	var DEFAULTS = {
		'includePointControl': false,
		'includeCoordinateControl': false,
		'includeGeocodeControl': false,
		'includeGeolocationControl': false,
		'location': null,
		'position': 'bottomleft',
		'el': null
	};

	var LocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));

			this._el = this.options.el || document.body;
			this._location = this.options.location || null;

			this.PointControl = this.options.PointControl || new PointControl();
			this.CoordinateControl = this.options.CoordinateControl || new CoordinateControl();
			this.GeocodeControl = this.options.GeocodeControl || new GeocodeControl();
			this.GeolocationControl = this.options.GeolocationControl || new GeolocationControl();
		},

		onAdd: function (map) {

			var informationControl;

			this._map = map;
			this._enabled = null;

			// create overlay with control information
			this._createInformationMenu();


			// Add Geolocate Control
			if (navigator && navigator.hasOwnProperty('geolocation') &&
						this.options.includeGeolocationControl) {
				this._map.addControl(this.GeolocationControl);
				this._geolocationControl = this.GeolocationControl._container;
				this.GeolocationControl.on('location', this.setLocation, this);
				this.GeolocationControl.on('locationError', this._onLocationError, this);
				this._geolocationControl.innerHTML =
						'<span>Use Current Location</span>';

				L.DomEvent.addListener(this._geolocationControl, 'click',
						function () { this._onClick('geolocation'); }, this);
			}

			// Add Geocode Control
			if (this.options.includeGeocodeControl) {
				this._map.addControl(this.GeocodeControl);
				this._geocodeControl = this.GeocodeControl._container.
						querySelector('.geocode-control-toggle');
				this.GeocodeControl.on('location', this.setLocation, this);
				this.GeocodeControl.on('locationError', this._onLocationError, this);
				this._geocodeControl.innerHTML = '<span>Search for Address</span>';

				L.DomEvent.addListener(this._geocodeControl, 'click',
						function () { this._onClick('geocode'); }, this);
			}

			// Add Coordinate Control
			if (this.options.includeCoordinateControl) {
				this._map.addControl(this.CoordinateControl);
				this._coordinateControl = this.CoordinateControl._container.
						querySelector('.leaflet-coordinate-control-toggle');
				this.CoordinateControl.on('location', this.setLocation, this);
				this._coordinateControl.innerHTML = '<span>Enter Coordinates</span>';
				
				L.DomEvent.addListener(this._coordinateControl, 'click',
						function () { this._onClick('coordinate'); }, this);
			}

			// Add Point Control
			if (this.options.includePointControl) {
				this._map.addControl(this.PointControl);
				this.PointControl.on('location', this.setLocation, this);
				this.PointControl.on('enabled', this._onControlEnabled, this);
			}

			// Create Information Control (i) button
			informationControl = L.DomUtil.create('a', 'information-control');
			informationControl.innerHTML = 'i';
			L.DomEvent.addListener(informationControl, 'click', function () {
					this._toggleInformationMenu();
				}, this);

			return informationControl;
		},


		/**
		 * Create a help/info menu with detailed descriptions of each control
		 * 
		 * @return {[type]} [description]
		 */
		_createInformationMenu: function () {
			var el = this._el,
			    informationList = L.DomUtil.create('ul', 'information-list'),
			    pointControlInfo,
			    coordinateControlInfo,
			    geocodeControlInfo,
			    geolocationControlInfo,
			    stop = L.DomEvent.stopPropagation;


			if (navigator && navigator.hasOwnProperty('geolocation') &&
						this.options.includeGeolocationControl) {
				geolocationControlInfo = L.DomUtil.create('li',
						'information-list-geolocate-control');
				geolocationControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p>Attempt to automatically locate my <b>current location</b>.</p>'
				].join('');
				informationList.appendChild(geolocationControlInfo);

				// enable geolocate control onclick
				L.DomEvent.addListener(geolocationControlInfo, 'click', function () {
						this._selectControl('geolocation');
					}, this);
			}

			if (this.options.includeGeocodeControl) {
				geocodeControlInfo = L.DomUtil.create('li',
						'information-list-geocode-control');
				geocodeControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p><b>Search</b> for a location using an <b>address</b>.</p>'
				].join('');
				informationList.appendChild(geocodeControlInfo);

				// enable geocode control on click
				L.DomEvent.addListener(geocodeControlInfo, 'click', function () {
						this._selectControl('geocode');
					}, this);
			}

			if (this.options.includeCoordinateControl) {
				coordinateControlInfo = L.DomUtil.create('li',
						'information-list-coordinate-control');
				coordinateControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p><b>Enter coordinates</b>, latitude and longitude.</p>'
				].join('');
				informationList.appendChild(coordinateControlInfo);

				// enable coordinate control on click
				L.DomEvent.addListener(coordinateControlInfo, 'click', function () {
						this._selectControl('coordinate');
					}, this);
			}

			if (this.options.includePointControl) {
				pointControlInfo = L.DomUtil.create('li',
						'information-list-point-control');
				pointControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p><b>Drop pin</b> on the map to specify a location.</p>'
				].join('');
				informationList.appendChild(pointControlInfo);

				// enable point control on click
				L.DomEvent.addListener(pointControlInfo, 'click', function () {
						this._selectControl('point');
					}, this);
			}

			// create div for information menu
			this._informationPanel = L.DomUtil.create('div', 'information-panel');
			this._informationPanel.appendChild(informationList);
			el.appendChild(this._informationPanel);

			// Hide information menu when any list item is selected.
			L.DomEvent.addListener(informationList, 'click', function (e) {
				L.DomUtil.addClass(this._informationPanel, 'hide');
				L.DomEvent.stop(e);
			}, this);

			// stop interaction with map when the information menu is visible
			L.DomEvent.on(this._informationPanel, 'mousedown', stop);
			L.DomEvent.on(this._informationPanel, 'dblclick', stop);
			L.DomEvent.on(this._informationPanel, 'wheel', stop);
		},

		/**
		 * Toggle the information menu. This is called on an information
		 * control click.
		 */
		_toggleInformationMenu: function () {
			if(L.DomUtil.hasClass(this._informationPanel, 'hide')) {
				// close all controls, display information panel
				this._deselectControl({'all': true});
				L.DomUtil.removeClass(this._informationPanel, 'hide');
			} else {
				// hide information panel
				L.DomUtil.addClass(this._informationPanel, 'hide');
			}
		},

		_onControlEnabled: function (e) {
			var target = e.target;
			// TODO: disable every control that isn't "target"
			if (target === null) {
			}
		},

		/**
		 * Handle the toggling for the group of controls. There are 3 cases:
		 *
		 *   - no active controls,
		 *     (enable selected control)
		 *
		 *   - active control is selected,
		 *     (disable the selected control)
		 *
		 *   - a control is selected that is not the active control,
		 *     (disable active control, enable selected control)
		 *
		 * @param  {string} selected,
		 *         The control that was just clicked. 
		 * 
		 */
		_onClick: function (selected) {
			var enabled = this._enabled;

			if (enabled === null) {
				// no controls are enabled, select new control;
				this._enabled = selected;
			} else if (enabled === selected) {
				// the enabled control was selected, and is now toggled off
				this._enabled = null;
			} else {
				// a different control was selected, deselect and select the new one
				this._deselectControl();
				this._enabled = selected;
			}
		},

		/**
		 * Enable the control passed in. This is used by the information menu
		 * which means that all controls will be disabled calling _selectControl
		 *
		 * @param  {string} control,
		 *         the control to enable.
		 */
		_selectControl: function (control) {
			// enable a control
			if (control === 'point') {
				this.PointControl.enable();
			} else if (control === 'coordinate') {
				this.CoordinateControl.toggle({enabled: true});
			} else if (control === 'geocode') {
				this.GeocodeControl.toggle();
			} else if (control === 'geolocation') {
				this.GeolocationControl.doGeolocate();
			}
			// keep track of the selected control
			this._enabled = control;
		},

		/**
		 * Disables a control, or disables all controls.
		 *
		 * @param  {object} options,
		 *         if the 'all' attribute is set to true, all controls are disabled.
		 */
		_deselectControl: function (options) {
			var enabled = this._enabled;

			// reset all controls
			if (options && options.hasOwnProperty('all') && options.all === true) {
				this.PointControl.disable();
				this.CoordinateControl.toggle({'enabled':false});
				this.GeocodeControl.disable();
				this._enabled = null;
				return;
			}

			if (enabled === 'point') {
				this.PointControl.disable();
			} else if (enabled === 'coordinate') {
				this.CoordinateControl.toggle();
			} else if (enabled === 'geocode') {
				this.GeocodeControl.toggle();
			}
		},

		onRemove: function () {
			if (this.options.includePointControl) {
				PointControl.onRemove();
			}
			if (this.options.includeCoordinateControl) {
				CoordinateControl.onRemove();
			}
			if (this.options.includeGeocodeControl) {
				GeocodeControl.onRemove();
			}
			if (this.options.includeGeolocateControl) {
				GeolocationControl.onRemove();
			}
			this._map = null;
			this._locationControl = null;
		},

		setLocation: function (location, options) {
			var zoomLevel;
			location = this._location =
					Util.extend({}, location, {type:null,target:null});

			// update all controls
			if (this.PointControl && this.PointControl.setLocation) {
				this.PointControl.setLocation(location, {'silent':true});
			}
			if (this.CoordinateControl && this.CoordinateControl.setLocation) {
				// trim to confidence number for coordinate control inputs
				this.CoordinateControl.setLocation(location, {'silent':true});
			}
			if (this.GeocodeControl && this.GeocodeControl.setLocation) {
				this.GeocodeControl.setLocation(location, {'silent':true});
			}

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

			if (!(options && options.silent)){
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
