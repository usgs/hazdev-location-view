/* global define */
define([
	'leaflet',
	'Geocoder'
], function (
	L,
	Geocoder
) {
	'use strict';

	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false
	};

	var GeocodeControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULT_OPTIONS, options));
			this._geocoder = new Geocoder();
			this._geocodeSuccess = this._geocodeSuccess.bind(this);
			this._geocodeError = this._geocodeError.bind(this);
		},

		setLocation: function (loc, options) {
			this._loc = loc;

			if (!(options && options.silent)) {
				this.fire('location', this._loc);
			}
		},

		getLocation: function () {
			return this._loc;
		},

		onAdd: function (map) {
			var container,
			    toggleButton,
			    textInput,
			    searchButton,
			    stop;

			container = this._container = L.DomUtil.create('div', 'GeocodeControl');
			toggleButton = this._toggleButton =
					L.DomUtil.create('a', 'geocode-control-toggle', container);
			textInput = this._textInput =
					L.DomUtil.create('input', 'geocode-control-input', container);
			searchButton = this._searchButton =
					L.DomUtil.create('button', 'geocode-control-submit', container);
			stop = L.DomEvent.stopPropagation;

			this._map = map;

			toggleButton.href = '#';
			textInput.placeholder = 'Address';
			searchButton.innerHTML = 'Search';

			L.DomEvent.on(textInput, 'keyup', this._onKeyUp, this);
			L.DomEvent.on(searchButton, 'click', this._onSearchClick, this);
			L.DomEvent.on(toggleButton, 'click', this._onToggleClick, this);
			L.DomEvent.on(container, 'keydown', stop);
			L.DomEvent.on(container, 'keyup', stop);
			L.DomEvent.on(container, 'keypress', stop);
			L.DomEvent.on(container, 'mousedown', stop);
			L.DomEvent.on(container, 'mouseup', stop);
			L.DomEvent.on(container, 'click', stop);
			L.DomEvent.on(container, 'dblclick', stop);

			return container;
		},

		_doGeocode: function (textAddress) {
			this._setLoading(true);
			this._geocoder.forward(textAddress,
					this._geocodeSuccess, this._geocodeError);
		},

		_onKeyUp: function (keyEvent) {
			if (keyEvent.keyCode === 13 && this._textInput.value !== '') {
				this._doGeocode(this._textInput.value);
			}
		},

		_onSearchClick: function (/*clickEvent*/) {
			if (this._textInput.value !== '') {
				this._doGeocode(this._textInput.value);
			}
		},

		_onToggleClick: function (/*clickEvent*/) {
			if (L.DomUtil.hasClass(this._container, 'geocode-control-expanded')) {
				L.DomUtil.removeClass(this._container, 'geocode-control-expanded');
			} else {
				L.DomUtil.addClass(this._container, 'geocode-control-expanded');
				this._textInput.focus();
			}
		},

		_geocodeSuccess: function (loc) {
			this._setLoading(false);
			this.setLocation(loc);
		},

		_geocodeError: function (statusCode, statusMessage) {
			this._setLoading(false);
			this.fire('locationError', statusCode, statusMessage);
		},

		_setLoading: function (loading) {
			if (loading) {
				L.DomUtil.addClass(this._container, 'loading');
				this._textInput.disabled = true;
				this._searchButton.disabled = true;
			} else {
				L.DomUtil.removeClass(this._container, 'loading');
				this._textInput.disabled = false;
				this._searchButton.disabled = false;
				this._textInput.focus();
			}
		}
	});

	return GeocodeControl;
});
