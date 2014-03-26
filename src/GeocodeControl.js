/* global define */
define([
	'leaflet',
	'Geocoder'
], function (
	L,
	Geocoder
) {
	'use strict';

	var CLASS_NAME = 'leaflet-geocode-control',
	    CLASS_ENABLED = CLASS_NAME + '-enabled',
	    CLASS_INPUT = CLASS_NAME + '-input',
	    CLASS_SUBMIT = CLASS_NAME + '-submit';

	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false,
		iconClass: CLASS_NAME + '-icon',
		helpText: 'Search for Address',
		infoText: '<b>Search</b> for a location using an <b>address</b>.'
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

			if (!loc || !loc.hasOwnProperty('place')) {
				this._textInput.value = '';
			} else {
				this._textInput.value = loc.place;
			}

			if (!(options && options.silent)) {
				this.fire('location', this._loc);
			}
		},

		getLocation: function () {
			return this._loc;
		},

		onAdd: function (map) {
			var options = this.options,
			    container,
			    toggle,
			    textInput,
			    searchButton,
			    stop;

			container = document.createElement('div');
			container.className = CLASS_NAME;
			container.innerHTML = [
				'<a href="#" class="', options.iconClass, '"></a>',
				'<span class="help">', options.helpText, '</span>',
				'<input class="', CLASS_INPUT, '" placeholder="Address"/>',
				'<button class="', CLASS_SUBMIT, '">Search</button>'
			].join('');

			toggle = container.querySelector('a');
			textInput = container.querySelector('.' + CLASS_INPUT);
			searchButton = container.querySelector('.' + CLASS_SUBMIT);
			stop = L.DomEvent.stopPropagation;

			this._container = container;
			this._toggle = toggle;
			this._textInput = textInput;
			this._searchButton = searchButton;
			this._map = map;

			L.DomEvent.addListener(textInput, 'keyup', this._onKeyUp, this);
			L.DomEvent.addListener(searchButton, 'click', this._onSearchClick, this);
			L.DomEvent.addListener(toggle, 'click', this.toggle, this);
			L.DomEvent.addListener(container, 'keydown', stop);
			L.DomEvent.addListener(container, 'keyup', stop);
			L.DomEvent.addListener(container, 'keypress', stop);
			L.DomEvent.addListener(container, 'mousedown', stop);
			L.DomEvent.addListener(container, 'mouseup', stop);
			L.DomEvent.addListener(container, 'click', stop);
			L.DomEvent.addListener(container, 'dblclick', stop);

			return container;
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation,
			    container = this._container,
			    toggle = this._toggle,
			    textInput = this._textInput,
			    searchButton = this._searchButton;

			L.DomEvent.removeListener(textInput, 'keyup', this._onKeyUp);
			L.DomEvent.removeListener(searchButton, 'click', this._onSearchClick);
			L.DomEvent.removeListener(toggle, 'click', this.toggle);
			L.DomEvent.removeListener(container, 'keydown', stop);
			L.DomEvent.removeListener(container, 'keyup', stop);
			L.DomEvent.removeListener(container, 'keypress', stop);
			L.DomEvent.removeListener(container, 'mousedown', stop);
			L.DomEvent.removeListener(container, 'mouseup', stop);
			L.DomEvent.removeListener(container, 'click', stop);
			L.DomEvent.removeListener(container, 'dblclick', stop);
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

		toggle: function (/*clickEvent*/) {
			if (L.DomUtil.hasClass(this._container, CLASS_ENABLED)) {
				this.disable();
			} else {
				this.enable();
			}
		},

		enable: function () {
			L.DomUtil.addClass(this._container, CLASS_ENABLED);
			this._textInput.focus();

			this.fire('enabled');
		},

		disable: function () {
			L.DomUtil.removeClass(this._container, CLASS_ENABLED);

			this.fire('disabled');
		},

		_geocodeSuccess: function (loc) {
			this._setLoading(false);
			this.setLocation(loc);
		},

		_geocodeError: function (statusCode, statusMessage) {
			this._setLoading(false);
			this.fire('locationError', {
				code: statusCode,
				message: statusMessage
			});
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
