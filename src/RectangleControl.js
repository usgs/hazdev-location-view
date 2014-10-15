/* global define */
define([
  'util/Util',
  'leaflet',

  'RectangleModel',
  'RectangleView'
], function (
  Util,
  L,

  RectangleModel,
  RectangleView
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
      this._view = this.options.view || new RectangleView({
        model: this._model,
        rectangleOptions: this.options.rectangleOptions
      });
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
      tooltip.innerHTML = 'Draw Rectangle on Map';

      this._map = map;

      L.DomEvent.addListener(button, 'click', this._initRectangle, this);
      L.DomEvent.addListener(container, 'click', stop);
      L.DomEvent.addListener(container, 'dblclick', stop);
      L.DomEvent.addListener(container, 'keydown', stop);
      L.DomEvent.addListener(container, 'keyup', stop);
      L.DomEvent.addListener(container, 'keypress', stop);
      L.DomEvent.addListener(container, 'mousedown', stop);

      return container;
    },

    onRemove: function () {
      var container = this._container,
          button = container.querySelector('a'),
          stop = L.DomEvent.stopPropagation;

      L.DomEvent.removeListener(button, 'click', this._initRectangle, this);
      L.DomEvent.removeListener(container, 'click', stop);
      L.DomEvent.removeListener(container, 'dblclick', stop);
      L.DomEvent.removeListener(container, 'keydown', stop);
      L.DomEvent.removeListener(container, 'keyup', stop);
      L.DomEvent.removeListener(container, 'keypress', stop);
      L.DomEvent.removeListener(container, 'mousedown', stop);

      this._map = null;
      this._container = null;
    },


    _initRectangle: function () {
      var map = this._map,
          mapContainer = map.getContainer();

      try {
        map.off('click', this._onClick, this);
      } catch (e) { /* Ignore */ }

      try {
        map.off('mousemove', this._onMouseMove, this);
      } catch (e) { /* Ignore */ }

      this._vertices = [];

      if (map.hasLayer(this._view)) {
        map.removeLayer(this._view);
      }

      mapContainer.classList.add(ACTIVE_CLASS_NAME);

      map.on('click', this._onClick, this);
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

        map.getContainer().classList.remove(ACTIVE_CLASS_NAME);

        this._updateModel();
      } else if (vertices.length === 1) {
        this._preview = L.rectangle([vertices[0], vertices[0]],
            this.options.rectangleOptions);
        this._preview.addTo(map);
        map.on('mousemove', this._onMouseMove, this);
      }
    },

    _updateModel: function () {
      var bounds = this._preview.getBounds(),
          ne = bounds.getNorthEast(),
          sw = bounds.getSouthWest();

      this._model.set({
        north: ne.lat,
        south: sw.lat,
        east: ne.lng,
        west: sw.lng
      });
    }

  });

  return RectangleControl;
});