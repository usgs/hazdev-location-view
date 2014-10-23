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
      ICON_CLASS_NAME = 'leaflet-rectangle-control-icon',
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
      this._tooltip = tooltip;

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

      this._vertices = [];

      if (active) {
        this.disable();
      } else {
        this.enable();
      }

      // update informational text
      this._nextStep();
    },

    enable: function () {
      var map = this._map;

      map.on('click', this._onClick, this);
      map.on('click', this._nextStep, this);

      this._tooltip.innerHTML = 'Remove Rectangle from Map';
      map.getContainer().classList.add(ACTIVE_CLASS_NAME);
    },

    disable: function () {
      var map = this._map;

      if (!map) {
        return;
      }

      this._model.set({north:null,south:null,east:null,west:null});

      if (map.hasLayer(this._view)) {
        map.removeLayer(this._view);
      }

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
          map = this._map;

      vertices.push(evt.latlng);

      if (vertices.length === 2) {
        // Done. Update model
        map.off('click', this._onClick, this);
        map.off('mousemove', this._onMouseMove, this);

        map.removeLayer(this._preview);
        map.addLayer(this._view);

        this._updateModel();
      } else if (vertices.length === 1) {
        this._preview = L.rectangle([vertices[0], vertices[0]],
            this.options.rectangleOptions);
        this._preview.addTo(map);
        map.on('mousemove', this._onMouseMove, this);
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

    _nextStep: function () {
      var container = this._map._container,
          nextStep = container.querySelector('.steps'),
          vertices = this._vertices,
          message,
          active;

      active = container.classList.contains(ACTIVE_CLASS_NAME);

      if (!active && vertices.length === 0) {
        container.removeChild(nextStep);
        nextStep = null;
        return;
      }

      if (!nextStep) {
        nextStep = document.createElement('p');
        nextStep.classList.add('alert', 'info', 'steps');
        container.appendChild(nextStep);
      }

      if (vertices.length === 0) {
        message = 'Click to select the starting corner for the rectangle.';
      } else if (vertices.length === 1) {
        message = 'Click again to select the final corner of the rectangle.';
      } else if (vertices.length === 2) {
        message = 'Resize the rectangle using its anchors, or reset the rectangle by clicking the button again.';
        this._map.off('click', this._nextStep, this);
      }

      // update the next step helper
      nextStep.innerHTML = message;

    }

  });

  return RectangleControl;
});