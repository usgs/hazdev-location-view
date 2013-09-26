/* global define */
define([
	'leaflet',
	'PointControl',
	'CoordinateControl',
	'GeocodeControl'
], function (
	L,
	PointControl,
	CoordinateControl,
	GeocodeControl
) {
	'use strict';

	var DEFAULTS = {
		'includePointControl': true,
		'includeCoordinateControl': true,
		'includeGeocodeControl': true,
		'location': null,
		'position': 'topleft'
	};

	var INNER_CLASS = 'leaflet-inner-location-control';
	var INNER_CLASS_DISABLED = 'leaflet-inner-location-control-disabled';

	var LocationControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));

			this._location = this.options.location || null;

			this.PointControl = this.options.PointControl || new PointControl();
			this.CoordinateControl = this.options.CoordinateControl || new CoordinateControl();
			this.GeocodeControl = this.options.GeocodeControl || new GeocodeControl();
		},

		onAdd: function (map) {

			this._map = map;
			this._enabled = null;
			this._toggled = false;



			var locationControl = this._locationControl = L.DomUtil.create('div', 'leaflet-location-control');

			var innerLocationControl = this._innerLocationControl = L.DomUtil.create('div', INNER_CLASS_DISABLED);

			this._toggleControl = L.DomUtil.create('a', 'leaflet-toggle-control leaflet-control');

			// TODO, create an icon for toggle control
			this._toggleControl.innerHTML = '*';
			locationControl.appendChild(this._toggleControl);
			locationControl.appendChild(this._innerLocationControl);

			L.DomEvent.addListener(this._toggleControl, 'click', function () { this._toggleControls(); }, this);

			if (this.options.includePointControl) {

				this._map.addControl(this.PointControl);

				this._pointControl = this.PointControl._container;

				this._pointControl.innerHTML = '<span>Drop/ Drag Pin</span>';
				innerLocationControl.appendChild(this._pointControl);

				L.DomEvent.addListener(this._pointControl, 'click', function () { this._onClick('point-control'); }, this);
			}

			if (this.options.includeCoordinateControl) {
				this._coordinateControl = L.DomUtil.create('a', 'leaflet-coordinate-control leaflet-control');
				this._coordinateControl.innerHTML = '<span>Enter Coordinates</span>';
				innerLocationControl.appendChild(this._coordinateControl);
				
				L.DomEvent.addListener(this._coordinateControl, 'click', function () { this._onClick('coordinate-control'); }, this);
			}

			if (this.options.includeGeocodeControl) {
				this._geocodeControl = L.DomUtil.create('a', 'leaflet-geocode-control leaflet-control');
				this._geocodeControl.innerHTML = '<span>Enter Address</span>';
				innerLocationControl.appendChild(this._geocodeControl);
				
				L.DomEvent.addListener(this._geocodeControl, 'click', function () { this._onClick('geocode-control'); }, this);
			}

			//TODO, add a geolocate control

			//TODO, listen to a location change, set location
			this.PointControl.on('location', this.setLocation, this);
			this.CoordinateControl.on('location', this.setLocation, this);

			//TODO, toggle location control

			// return locationControl
			return locationControl;
		},


		_onClick: function (selected) {

			var enabled = this._enabled;

			if (enabled === null) {
				// no controls are enabled, select new control
				this._selectControl(selected);
			} else if (enabled === selected) {
				// the enabled control was selected, deselect it
				this._deselectControl(selected);
			} else {
				// a different control was selected, deselect and select the new one
				this._deselectControl(enabled);
				this._selectControl(selected);
			}
		},

		_selectControl: function (control) {
			if (control === 'point-control') {
				//this.PointControl.onAdd(this._map);
				L.DomUtil.addClass(this._pointControl, 'enabled');
			} else if (control === 'coordinate-control') {
				//this.CoordinateControl.onAdd(this._map);// ?? Why doesn't this work ??
				this._map.addControl(this.CoordinateControl);
				L.DomUtil.addClass(this._coordinateControl, 'enabled');
			} else if (control === 'geocode-control') {
				//this.GeocodeControl.onAdd(this._map);
				L.DomUtil.addClass(this._geocodeControl, 'enabled');
			}
			// keep track of the enabled control
			this._enabled = control;


		},

		_deselectControl: function (control) {
			if (control === 'point-control') {
				this.PointControl.disableControl();
				L.DomUtil.removeClass(this._pointControl, 'enabled');
			} else if (control === 'coordinate-control') {
				this._map.removeControl(this.CoordinateControl);
				L.DomUtil.removeClass(this._coordinateControl, 'enabled');
			} else if (control === 'geocode-control') {
				//this._map.removeControl(this.GeocodeControl);
				L.DomUtil.removeClass(this._geocodeControl, 'enabled');
			}
			// deselect
			this._enabled = null;
		},

		onRemove: function () {

			if (this.options.includePointControl) {
				this._pointControl = null;
				L.DomEvent.removeListener(this._pointControl, 'click', function () { this._onClick('point-control'); });
			}

			if (this.options.includeCoordinateControl) {
				this._coordinateControl = null;
				L.DomEvent.removeListener(this._coordinateControl, 'click', CoordinateControl.onAdd(this._map));
			}

			if (this.options.includeGeocodeControl) {
				this._geocodeControl = null;
				// L.DomEvent.removeListener(this._geocodeControl, 'click', GeocodeControl.onAdd(this._map));
			}


			this._map = null;
			this._locationControl = null;
		},

		setLocation: function (location, options) {
			this._location = location;

			if (!(options && options.silent)){
				this.fire('location', this._location);
			}
		},

		getLocation: function () {
			return this._location;
		},

		_toggleControls: function () {
			// at least one control is enabled, then location control is visible
			if (this._toggled) {
				// Hide
				L.DomUtil.removeClass(this._innerLocationControl, INNER_CLASS);
				L.DomUtil.addClass(this._innerLocationControl, INNER_CLASS_DISABLED);

				// remove open control
				this._deselectControl(this._enabled);
			} else {
				// Show
				L.DomUtil.removeClass(this._innerLocationControl, INNER_CLASS_DISABLED);
				L.DomUtil.addClass(this._innerLocationControl, INNER_CLASS);
			}

			this._toggled = !(this._toggled);
		}


	});

	return LocationControl;
});
