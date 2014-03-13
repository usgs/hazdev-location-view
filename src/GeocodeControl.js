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
					L.DomUtil.create('a', 'geocode-control-submit', container);
			stop = L.DomEvent.stopPropagation;

			this._map = map;

			toggleButton.href = '#';
			textInput.placeholder = 'Address';
			searchButton.innerHTML = 'Search';
			searchButton.href = '#';

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
			this._geocoder.forward(textAddress, (function (control) {
				return function (geocodeResult) {
					control.setLocation(geocodeResult);
				};
			})(this));
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
		}
	});

	return GeocodeControl;
});
