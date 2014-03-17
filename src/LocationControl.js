/* global define */
define([
	'leaflet',
	'PointControl',
	'CoordinateControl',
	'GeocodeControl',
	'ConfidenceCalculator'
], function (
	L,
	PointControl,
	CoordinateControl,
	GeocodeControl,
	ConfidenceCalculator
) {
	'use strict';

	var DEFAULTS = {
		'includePointControl': false,
		'includeCoordinateControl': false,
		'includeGeocodeControl': false,
		'includeGeolocateControl': false,
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
			this.CoordinateControl = this.options.CoordinateControl ||
					new CoordinateControl();
			this.GeocodeControl = this.options.GeocodeControl || new GeocodeControl();

		},

		onAdd: function (map) {

			var informationControl;

			this._map = map;
			this._enabled = null;
			this._informationPanel = L.DomUtil.create('div', 'information-panel');

			this._map.on('location', this.setLocation, this);

			// Add Point Control
			if (this.options.includePointControl) {
				this._map.addControl(this.PointControl);
				this._pointControl = this.PointControl._container;
				this._pointControl.innerHTML = '<span>Drop/ Drag Pin</span>';
				this.PointControl.on('location', this.setLocation, this);

				L.DomEvent.addListener(this._pointControl, 'click',
						function () { this._onClick('point-control'); }, this);
			}

			// Add Coordinate Control
			if (this.options.includeCoordinateControl) {
				this._map.addControl(this.CoordinateControl);
				this._coordinateControl = this.CoordinateControl._container;
				this.CoordinateControl.on('location', this.setLocation, this);

				this._coordinateControlToggle = this._coordinateControl.querySelector(
						'.leaflet-coordinate-control-toggle');
				this._coordinateControlToggle.innerHTML =
						'<span>Enter Coordinates</span>';
				
				L.DomEvent.addListener(this._coordinateControlToggle, 'click',
						function () { this._onClick('coordinate-control'); }, this);
			}

			//TODO, Add Geocode Control
			if (this.options.includeGeocodeControl) {
				this._map.addControl(this.GeocodeControl);
				this._geocodeControl = this.GeocodeControl._container;
				this.GeocodeControl.on('location', this.setLocation, this);

				this._geocodeControlToggle = this._geocodeControl.querySelector(
						'.leaflet-geocode-control-toggle');
				this._geocodeControl.querySelector('a').innerHTML =
						'<span>Enter Address</span>';

				L.DomEvent.addListener(this._geocodeControl, 'click',
						function () { this._onClick('geocode-control'); }, this);
			}

			//TODO, Add Geolocate Control
			if (this.options.includeGeolocateControl) {
				this._map.addControl(this.GeolocateControl);
				this._geolocateControl = this.GeolocateControl._container;
				this.GeolocateControl.on('location', this.setLocation, this);

				this._geolocateControlToggle = this._geolocateControl.querySelector(
						'.leaflet-geolocate-control-toggle');
				this._geolocateControl.querySelector('a').innerHTML =
						'<span>Find Me</span>';

				L.DomEvent.addListener(this._geolocateControl, 'click',
						function () { this._onClick('geolocate-control'); }, this);
			}

			// create overlay with control information
			this._createInformationPanel();

			// create information control that enables detailed information
			informationControl = L.DomUtil.create('a', 'information-control');
			informationControl.innerHTML = 'i';
			L.DomEvent.addListener(informationControl, 'click', function (e) {
				this._toggleInformationPanel();
				L.DomEvent.stop(e); // stops interaction with map
			}, this);

			return informationControl;
		},


		_createInformationPanel: function () {
			var el = this._el,
			    informationList = L.DomUtil.create('ul', 'information-list'),
			    pointControlInfo,
			    coordinateControlInfo,
			    geocodeControlInfo,
			    geolocateControlInfo;

			if (this.options.includePointControl) {
				pointControlInfo = L.DomUtil.create('li',
						'information-list-point-control');
				pointControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p>Click on the map to specify a location.</p>'
				].join('');
				informationList.appendChild(pointControlInfo);

				// toggle point control
				L.DomEvent.addListener(pointControlInfo, 'click', function () {
						this._pointControl.click();
					}, this);
			}

			if (this.options.includeCoordinateControl) {
				coordinateControlInfo = L.DomUtil.create('li',
						'information-list-coordinate-control');
				coordinateControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p>Enter latitude and longitude coordinates.</p>'
				].join('');
				informationList.appendChild(coordinateControlInfo);

				// toggle coordinate control
				L.DomEvent.addListener(coordinateControlInfo, 'click', function () {
						this._coordinateControlToggle.click();
					}, this);
			}

			if (this.options.includeGeocodeControl) {
				geocodeControlInfo = L.DomUtil.create('li',
						'information-list-geocode-control');
				geocodeControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p>Search for a location using an address.</p>'
				].join('');
				informationList.appendChild(geocodeControlInfo);

				//toggle geocode control
				L.DomEvent.addListener(geocodeControlInfo, 'click', function () {
						this._geocodeControlToggle.click();
					}, this);
			}

			if (this.options.includeGeolocateControlInfo) {
				geolocateControlInfo = L.DomUtil.create('li',
						'information-list-geolocate-control');
				geolocateControlInfo.innerHTML = [
					'<span class="icon"></span>',
					'<p>Attempt to automatically locate my current location.</p>'
				].join('');
				informationList.appendChild(geolocateControlInfo);

				// toggle geolocate control
				L.DomEvent.addListener(geolocateControlInfo, 'click', function () {
						this._geolocateControlToggle.click();
					}, this);
			}

			// Hide information panel when any list item is selected.
			L.DomEvent.addListener(informationList, 'click', function (e) {
				L.DomUtil.addClass(this._informationPanel, 'hide');
				L.DomEvent.stop(e);
			}, this);

			// stop interaction with map from under the information panel
			L.DomEvent.addListener(this._informationPanel, 'mousedown', function (e) {
				L.DomEvent.stop(e);
			}, this);

			this._informationPanel.appendChild(informationList);
			el.appendChild(this._informationPanel);
		},


		_toggleInformationPanel: function () {
			if(L.DomUtil.hasClass(this._informationPanel, 'hide')) {
				L.DomUtil.removeClass(this._informationPanel, 'hide');
				// close all controls
				this._deselectControl();
			} else {
				L.DomUtil.addClass(this._informationPanel, 'hide');
			}
		},

		_onClick: function (selected) {
			var enabled = this._enabled;

			if (enabled === null) {
				// no controls are enabled, select new control
				this._selectControl(selected);
			} else if (enabled === selected) {
				// the enabled control was selected, deselect it
				this._deselectControl();
			} else {
				// a different control was selected, deselect and select the new one
				this._deselectControl();
				this._selectControl(selected);
			}
		},

		_selectControl: function (control) {
			// enable a control
			if (control === 'point-control') {
				L.DomUtil.addClass(this._pointControl, 'enabled');
			} else if (control === 'coordinate-control') {
				L.DomUtil.addClass(this._coordinateControl, 'enabled');
			} else if (control === 'geocode-control') {
				L.DomUtil.addClass(this._geocodeControl, 'enabled');
			}
			// keep track of the enabled control
			this._enabled = control;
		},

		_deselectControl: function () {
			// check for enabled control to disable it
			if(this._pointControl &&
					L.DomUtil.hasClass(this._pointControl, 'enabled')) {
				this.PointControl.disableControl();
				L.DomUtil.removeClass(this._pointControl, 'enabled');
			} else if (this._coordinateControl &&
					L.DomUtil.hasClass(this._coordinateControl, 'enabled')) {
				L.DomUtil.removeClass(this._coordinateControl, 'enabled');
			} else if (this._geolocateControl &&
					L.DomUtil.hasClass(this._geolocateControl, 'enabled')) {
				L.DomUtil.removeClass(this._geolocateControl, 'enabled');
			} else if (this._geocodeControl &&
					L.DomUtil.hasClass(this._geocodeControl, 'enabled')) {
				L.DomUtil.removeClass(this._geocodeControl, 'enabled');
			}

			this._enabled = null;
		},

		onRemove: function () {
			if (this.options.includePointControl) {
				L.DomEvent.removeListener(this._pointControl, 'click',
						function () { this._onClick('point-control'); });
			}
			if (this.options.includeCoordinateControl) {
				L.DomEvent.removeListener(this._coordinateControl, 'click',
						CoordinateControl.onAdd(this._map));
			}
			if (this.options.includeGeocodeControl) {
				L.DomEvent.removeListener(this._geocodeControl, 'click',
						GeocodeControl.onAdd(this._map));
			}
			if (this.options.includeGeolocateControl) {
				// TODO, add GeolocateControl
				//L.DomEvent.removeListener(this._geolcoateControl, 'click', GeolocateControl.onAdd(this._map));
			}
			this._map = null;
			this._locationControl = null;
		},

		setLocation: function (location, options) {
			var zoomLevel;
			this._location = location;

			// update all controls
			if (this.PointControl && this.PointControl.setLocation) {
				this.PointControl.setLocation(location, {'silent':true});
			}
			if (this.CoordinateControl && this.CoordinateControl.setLocation) {
				// trim to confidence number for coordinate control inputs
				if (location.confidence !== null) {
					location.latitude = location.latitude.toFixed(location.confidence);
					location.longitude = location.longitude.toFixed(location.confidence);
				}
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

			// center the map
			this._map.setView({
					lon: location.longitude,
					lat: location.latitude
				},
				zoomLevel
			);

			if (!(options && options.silent)){
				this.fire('location', this._location);
			}
		},

		getLocation: function () {
			return this._location;
		}


	});

	return LocationControl;
});
