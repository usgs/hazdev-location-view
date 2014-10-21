/* global define */
define([
	'leaflet',

	'./Geocoder'
], function (
	L,
	Geocoder
) {
	'use strict';

	var CLASS_NAME = 'leaflet-geocode-control',
	    CLASS_ENABLED = CLASS_NAME + '-enabled',
	    CLASS_INPUT = 'leaflet-control-input',
	    CLASS_SUBMIT = 'leaflet-control-submit';

	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false,
		iconClass: 'leaflet-control-icon',
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

		setLocation: function (location, options) {
			this._location = location;

			if (!location || !location.hasOwnProperty('place')) {
				this._address.value = '';
			} else {
				this._address.value = location.place;
			}

			if (!(options && options.silent)) {
				this.fire('location', {'location': location});
			}
		},

		getLocation: function () {
			return this._location;
		},

		onAdd: function (map) {
			var options = this.options,
			    stop = L.DomEvent.stopPropagation,
			    container,
			    control,
			    toggle;

			container = document.createElement('div');
			container.classList.add(CLASS_NAME);
			container.innerHTML = [
				'<a class="', options.iconClass, '"></a>',
				'<span class="help">', options.helpText, '</span>',
				'<div class="', CLASS_INPUT, '">',
					'<input name="address" title="address" class="address" ',
							'placeholder="Address"/>',
					'<button type="search" class="', CLASS_SUBMIT, '">Search</button>',
				'</div>'
			].join('');

			toggle = container.querySelector('a');
			control = container.querySelector('.' + CLASS_INPUT);

			this._container = container;
			this._toggle = toggle;
			this._control = control;
			this._address = control.querySelector('.address');
			this._submit = container.querySelector('.' + CLASS_SUBMIT);
			this._map = map;

			L.DomEvent.addListener(this._address, 'keyup', this._onKeyUp, this);
			L.DomEvent.addListener(this._submit, 'click', this._onSearchClick, this);
			L.DomEvent.addListener(toggle, 'click', this.toggle, this);
			L.DomEvent.addListener(container, 'click', stop);
			L.DomEvent.addListener(container, 'dblclick', stop);
			L.DomEvent.addListener(container, 'keydown', stop);
			L.DomEvent.addListener(container, 'keyup', stop);
			L.DomEvent.addListener(container, 'keypress', stop);
			L.DomEvent.addListener(container, 'mousedown', stop);
			L.DomEvent.addListener(this._address, 'touchstart', stop);

			return container;
		},

		onRemove: function () {
			var stop = L.DomEvent.stopPropagation,
			    container = this._container,
			    toggle = this._toggle;

			L.DomEvent.removeListener(this._address, 'keyup', this._onKeyUp);
			L.DomEvent.removeListener(this._submit, 'click', this._onSearchClick);
			L.DomEvent.removeListener(toggle, 'click', this.toggle);
			L.DomEvent.removeListener(container, 'click', stop);
			L.DomEvent.removeListener(container, 'dblclick', stop);
			L.DomEvent.removeListener(container, 'keydown', stop);
			L.DomEvent.removeListener(container, 'keyup', stop);
			L.DomEvent.removeListener(container, 'keypress', stop);
			L.DomEvent.removeListener(container, 'mousedown', stop);
			L.DomEvent.removeListener(this._address, 'touchstart', stop);
		},

		_doGeocode: function (textAddress) {
			this._setLoading(true);
			this._geocoder.forward(textAddress,
					this._geocodeSuccess, this._geocodeError);
		},

		_onKeyUp: function (keyEvent) {
			if (keyEvent.keyCode === 13 && this._address.value !== '') {
				this._doGeocode(this._address.value);
			}
		},

		_onSearchClick: function (/*clickEvent*/) {
			if (this._address.value !== '') {
				this._doGeocode(this._address.value);
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
			this._address.focus();

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
				this._address.disabled = true;
				this._submit.disabled = true;
			} else {
				L.DomUtil.removeClass(this._container, 'loading');
				this._address.disabled = false;
				this._submit.disabled = false;
				this._address.focus();
			}
		}
	});

	return GeocodeControl;
});
