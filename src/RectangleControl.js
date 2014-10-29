/* global define */
define([
  'util/Util',
  'leaflet',

  'RectangleModel',
  'RectangleOverlayView'
], function (
  Util,
  L,

  RectangleModel,
  RectangleOverlayView
) {
  'use strict';

  var CLASS_NAME = 'leaflet-rectangle-control',
      ICON_CLASS_NAME = 'leaflet-control-icon',
      ACTIVE_CLASS_NAME = 'leaflet-rectangle-control-active';

  var DEFAULTS = {
    position: 'topleft',

    rectangleOptions: {
      weight: 1,
      color: '#900',
      opacity: 1,
      fillOpacity: 0.4,
      clickable: false
    }
  };

  var RectangleControl = L.Control.extend({
    includes: [L.Mixin.Events],

    initialize: function (options) {
      L.setOptions(this, Util.extend({}, DEFAULTS, options||{}));

      this._model = this.options.model || RectangleModel();
      this._view = this.options.view || new RectangleOverlayView({
        model: this._model,
        rectangleOptions: this.options.rectangleOptions
      });

      this._model.on('change', this._onModelChange, this);
    },

    destroy: function () {
      this._map.off('click', this._onClick, this);
      this._map.off('click', this.displayInstruction, this);
      this._map.off('mousemove', this._onMouseMove, this);
      this._model.off('change', this._onModelChange, this);
      this.onRemove();
    },

    onAdd: function (map) {
      var container = document.createElement('div'),
          button = container.appendChild(document.createElement('a')),
          tooltip = container.appendChild(document.createElement('span')),
          stop = L.DomEvent.stopPropagation;

      container.classList.add(CLASS_NAME);
      button.classList.add(ICON_CLASS_NAME);
      tooltip.classList.add('help');

      // TODO :: Use icon instead
      button.innerHTML = 'R';

      this._map = map;
      this._container = container;
      this._tooltip = tooltip;
      this._vertices = [];

      L.DomEvent.addListener(button, 'click', this.toggle, this);
      L.DomEvent.addListener(container, 'click', stop);
      L.DomEvent.addListener(container, 'dblclick', stop);
      L.DomEvent.addListener(container, 'keydown', stop);
      L.DomEvent.addListener(container, 'keyup', stop);
      L.DomEvent.addListener(container, 'keypress', stop);
      L.DomEvent.addListener(container, 'mousedown', stop);

      if (this._model.get('north') || this._model.get('south') ||
          this._model.get('east') || this._model.get('west')) {
        this._map.addLayer(this._view);
      }

      return container;
    },

    onRemove: function () {
      var container = this._container,
          button = container.querySelector('a'),
          stop = L.DomEvent.stopPropagation;

      L.DomEvent.removeListener(button, 'click', this.toggle, this);
      L.DomEvent.removeListener(container, 'click', stop);
      L.DomEvent.removeListener(container, 'dblclick', stop);
      L.DomEvent.removeListener(container, 'keydown', stop);
      L.DomEvent.removeListener(container, 'keyup', stop);
      L.DomEvent.removeListener(container, 'keypress', stop);
      L.DomEvent.removeListener(container, 'mousedown', stop);

      this._map = null;
      this._container = null;
      this._tooltip = null;
      this._vertices = null;
    },

    toggle: function (/*clickEvent*/) {
      var map = this._map,
          mapContainer = map.getContainer(),
          active = mapContainer.classList.contains(ACTIVE_CLASS_NAME);

      try {
        map.off('click', this._onClick, this);
      } catch (e) { /* Ignore */ }

      try {
        map.off('mousemove', this._onMouseMove, this);
      } catch (e) { /* Ignore */ }

      if (active) {
        this.disable();
      } else {
        this.enable();
      }
    },

    enable: function () {
      var map = this._map,
          mapContainer = map.getContainer(),
          active = mapContainer.classList.contains(ACTIVE_CLASS_NAME);

      // Skips if control was previously made active
      if (active) {
        return;
      }

      // rectangle has been drawn
      if (map.hasLayer(this._view)){
        mapContainer.classList.add(ACTIVE_CLASS_NAME);
      } else {
        map.on('click', this._onClick, this);
        map.on('click', this.displayInstruction, this);
        mapContainer.classList.add(ACTIVE_CLASS_NAME, 'drawing-rectangle');
      }

      // update tooltip
      this._tooltip.innerHTML = 'Remove Rectangle from Map';
      // update informational text
      this.displayInstruction();

    },

    disable: function () {
      var map = this._map,
          mapContainer = map.getContainer(),
          instructionEl = mapContainer.querySelector('.instruction');

      if (!map) {
        return;
      }

      map.off('click', this.displayInstruction, this);
      this._model.set({north:null,south:null,east:null,west:null});

      if (map.hasLayer(this._view)) {
        map.removeLayer(this._view);
      }

      if (instructionEl) {
        mapContainer.removeChild(instructionEl);
        instructionEl = null;
      }

      this._vertices = [];
      this._tooltip.innerHTML = 'Draw Rectangle on Map';
      map.getContainer().classList.remove(ACTIVE_CLASS_NAME);
    },

    _onModelChange: function () {
      var map = this._map,
          model = this._model,
          view = this._view,
          north = model.get('north'),
          south = model.get('south'),
          east = model.get('east'),
          west = model.get('west');

      if (map) {
        if (map.hasLayer(view) && north === null && south === null &&
            east === null && west === null) {
          map.removeLayer(view);
        } else if (!map.hasLayer(view) && (north !== null || south !== null ||
            east !== null || west !== null)) {
          map.addLayer(view);
        }
      }
    },

    _onMouseMove: function (evt) {
      this._preview.setBounds([this._vertices[0], evt.latlng]);
    },

    _onClick: function (evt) {
      var vertices = this._vertices,
          map = this._map,
          mapContainer = map.getContainer(),
          icon = L.divIcon({className: 'first-marker'});

      vertices.push(evt.latlng);

      if (vertices.length === 2) {
        map.off('click', this._onClick, this);
        map.off('mousemove', this._onMouseMove, this);

        map.removeLayer(this._firstClickMarker);
        map.removeLayer(this._preview);
        map.addLayer(this._view);

        // updates cursor once user is done drawing rectangle
        mapContainer.classList.remove('drawing-rectangle');

        // Done. Update model
        this._updateModel();
      } else if (vertices.length === 1) {
        this._preview = L.rectangle([vertices[0], vertices[0]],
            this.options.rectangleOptions);
        this._preview.addTo(map);
        map.on('mousemove', this._onMouseMove, this);

        // mark first click (helpful on mobile)
        this._firstClickMarker = L.marker(evt.latlng, { icon: icon});
        this._firstClickMarker.addTo(map);
      }
    },

    _updateModel: function () {
      var bounds = L.latLngBounds(this._vertices),
          ne = bounds.getNorthEast(),
          sw = bounds.getSouthWest();

      this._model.set({
        north: ne.lat,
        south: sw.lat,
        east: ne.lng,
        west: sw.lng
      });
    },


    /**
     * Display instructions that explain how to use the currently
     * selected location control.
     *
     * Cleans up after itself once the control is toggled off.
     */
    displayInstruction: function () {
      var mapContainer = this._map.getContainer(),
          instructionEl = mapContainer.querySelector('.instruction');

      if (!instructionEl) {
        instructionEl = document.createElement('p');
        instructionEl.classList.add('alert', 'info', 'instruction');
        mapContainer.appendChild(instructionEl);
      }

      // update instruction element with next message
      instructionEl.innerHTML = this._getMessage();
    },


    /**
     * Return an instructional message based on the current step in the
     * process of drawing a rectangle on a map.
     *
     * @return {String}
     *         help messsage.
     */
    _getMessage: function () {
      var step = this._vertices.length,
          message = '';

      if (this._map.hasLayer(this._view)) {
        step = 2;
      }

      if (step === 0) {
        message = 'Click to select the starting corner for the rectangle.';
      } else if (step === 1) {
        message = 'Click again to select the final corner of the rectangle.';
      } else if (step === 2) {
        message = 'Resize the rectangle using its anchors, or reset the ' +
            'rectangle by clicking the button again.';
      }

      return message;
    }

  });

  return RectangleControl;
});