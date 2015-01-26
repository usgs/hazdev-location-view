'use strict';


var L = require('LeafletShim'),
    RectangleModel = require('RectangleModel'),
    Util = require('util/Util');


var CLASS_ICON_NAME = 'rectangle-view-icon',
    CLASS_ICON_TOP_NAME = 'rectangle-view-icon-top',
    CLASS_ICON_BOTTOM_NAME = 'rectangle-view-icon-bottom',
    CLASS_ICON_RIGHT_NAME = 'rectangle-view-icon-right',
    CLASS_ICON_LEFT_NAME = 'rectangle-view-icon-left';

var DEFAULTS = {
  model: null,
  gripOptions: {
    draggable: true
  },
  topGripper: {
    icon: L.divIcon({
      iconSize: [46, 46],
      className: CLASS_ICON_NAME + ' ' + CLASS_ICON_TOP_NAME
    })
  },
  bottomGripper: {
    icon: L.divIcon({
      iconSize: [46, 46],
      className: CLASS_ICON_NAME + ' ' + CLASS_ICON_BOTTOM_NAME
    })

  },
  rightGripper: {
    icon: L.divIcon({
      iconSize: [46, 46],
      className: CLASS_ICON_NAME + ' ' + CLASS_ICON_RIGHT_NAME
    })

  },
  leftGripper: {
    icon: L.divIcon({
      iconSize: [46, 46],
      className: CLASS_ICON_NAME + ' ' + CLASS_ICON_LEFT_NAME
    })

  },
  rectangleOptions: {
    weight: 1,
    color:'#900',
    opacity: 1,
    fillOpacity: 0.4,
    clickable:false
  }
};

var RectangleOverlayView = L.LayerGroup.extend({

  initialize: function (options) {

    L.Util.setOptions(this, Util.extend({}, DEFAULTS, options));

    this._model = options.model || RectangleModel();
    this._model.on('change', this.render, this);

    this._top = L.marker([0.0, 0.0], Util.extend({},
        this.options.gripOptions, this.options.topGripper));
    this._bottom = L.marker([0.0, 0.0], Util.extend({},
        this.options.gripOptions, this.options.bottomGripper));

    this._right = L.marker([0.0, 0.0], Util.extend({},
        this.options.gripOptions, this.options.rightGripper));
    this._left = L.marker([0.0, 0.0], Util.extend({},
        this.options.gripOptions, this.options.leftGripper));

    this._rectangle = L.rectangle([[0.0, 0.0], [0.0, 0.0]],
        this.options.rectangleOptions);

    this._top.on('dragstart', this._onDragStart, this);
    this._bottom.on('dragstart', this._onDragStart, this);
    this._right.on('dragstart', this._onDragStart, this);
    this._left.on('dragstart', this._onDragStart, this);

    this._top.on('drag', this._onDrag, this);
    this._bottom.on('drag', this._onDrag, this);
    this._right.on('drag', this._onDrag, this);
    this._left.on('drag', this._onDrag, this);

    this._top.on('dragend', this._onDragEnd, this);
    this._bottom.on('dragend', this._onDragEnd, this);
    this._right.on('dragend', this._onDragEnd, this);
    this._left.on('dragend', this._onDragEnd, this);

    // Call parent constructor
    L.LayerGroup.prototype.initialize.call(this,
        [this._top, this._bottom, this._left, this._right, this._rectangle]);
  },

  destroy: function () {
    // remove bindings
    this._model.off('change', this.render, this);

    this._top.off('dragstart', this._onDragStart, this);
    this._bottom.off('dragstart', this._onDragStart, this);
    this._right.off('dragstart', this._onDragStart, this);
    this._left.off('dragstart', this._onDragStart, this);

    this._top.off('drag', this._onDrag, this);
    this._bottom.off('drag', this._onDrag, this);
    this._right.off('drag', this._onDrag, this);
    this._left.off('drag', this._onDrag, this);

    this._top.off('dragend', this._onDragEnd, this);
    this._bottom.off('dragend', this._onDragEnd, this);
    this._right.off('dragend', this._onDragEnd, this);
    this._left.off('dragend', this._onDragEnd, this);

    // clean up variables
    this._top = null;
    this._bottom = null;
    this._right = null;
    this._left = null;
    this._rectangle = null;
  },

  onAdd: function (map) {
    //this._model.on('change', this.render, this);
    L.LayerGroup.prototype.onAdd.call(this, map);

    this.render();
  },

  onRemove: function (map) {
    //this._model.off('change', this.render, this);
    L.LayerGroup.prototype.onRemove.call(this, map);
  },

  render: function () {
    var north,
        south,
        east,
        west,
        updateTopBottom = true,
        updateRightLeft = true;

    if (!this._map) {
      return;
    }

    north = this._model.get('north') || 90.0;
    south = this._model.get('south') || -90.0;
    east = this._model.get('east') || 180.0;
    west = this._model.get('west') || -180.0;

    this._computeMidpoints(north, south, east, west);

    if (this._activeHandle === this._top ||
        this._activeHandle === this._bottom) {
      // Only update left/right
      updateTopBottom = false;
    } else if (this._activeHandle === this._right ||
        this._activeHandle === this._left) {
      // Only update top/bottom
      updateRightLeft = false;
    }

    if (updateTopBottom) {
      this._top.setLatLng([north, this._midLng]);
      this._bottom.setLatLng([south, this._midLng]);
    }

    if (updateRightLeft) {
      this._right.setLatLng([this._midLat, east]);
      this._left.setLatLng([this._midLat, west]);
    }

    this._rectangle.setBounds([[north, east], [south, west]]);
  },

  _computeMidpoints: function (north, south, east, west) {
    var top,
        bot,
        mid;

    // Translate between geo/px to account for projection
    top = this._map.latLngToLayerPoint([north, 0]);
    bot = this._map.latLngToLayerPoint([south, 0]);
    mid = bot.y + ((top.y - bot.y) / 2);

    this._midLng = west + ((east - west) / 2);
    this._midLat = this._map.layerPointToLatLng([0, mid]).lat;
  },

  _onDragStart: function (evt) {
    this._activeHandle = evt.target;
  },

  _onDrag: function () {
    var activeHandle = this._activeHandle,
        latlng = activeHandle.getLatLng(),
        lat = latlng.lat,
        lng = latlng.lng;

    if (activeHandle === this._top || activeHandle === this._bottom) {
      lng = this._midLng;
    } else {
      lat = this._midLat;
    }

    activeHandle.setLatLng([lat, lng]);

    this._updateModel();
  },

  _onDragEnd: function (/*evt*/) {
    this._activeHandle = null;
  },



  _updateModel: function (/*evt*/) {
    var north = this._top.getLatLng().lat,
        south = this._bottom.getLatLng().lat,
        east = this._right.getLatLng().lng,
        west = this._left.getLatLng().lng;

    this._model.set({
      north: Math.max(north, south),
      south: Math.min(north, south),
      east: Math.max(east, west),
      west: Math.min(east, west)
    });
  }
});

module.exports = RectangleOverlayView;