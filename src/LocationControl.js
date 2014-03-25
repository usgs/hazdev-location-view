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
		'includeGeolocationControl':
				navigator && navigator.hasOwnProperty('geolocation'),
		'location': null,
		'position': 'bottomleft',
		'el': null
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
			var _this = this,
			    informationControl;

			this._map = map;
			this._enabled = null;

			// create overlay with control information
			this._createInformationMenu();

			this._eachControl(function (control) {
				map.addControl(control);
				control.on('location', _this.setLocation, _this);
				control.on('locationError', _this._onLocationError, _this);
				control.on('enabled', _this._onControlEnabled, _this);
			});

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
			var target = null;

			if (e) {
				target = e.target;
			}

			this._eachControl(function (control) {
				if (control !== target) {
					control.disable();
				}
			});
		},


		onRemove: function () {
			var _this = this;

			this._eachControl(function (control) {
				_this.map.removeControl(control);
				control.off('location', _this.setLocation, _this);
				control.off('locationError', _this._onLocationError, _this);
				control.off('enabled', _this._onControlEnabled, _this);
			});

			// TODO: remove information menu

			this._map = null;
			this._locationControl = null;
		},


		setLocation: function (location, options) {
			var zoomLevel;

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
