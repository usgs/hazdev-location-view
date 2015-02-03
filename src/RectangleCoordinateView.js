'use strict';


var L = require('LeafletShim'),
    RectangleModel = require('RectangleModel'),
    Util = require('util/Util');


var CLASS_NAME = 'rectangle-coordinate-view';

var DEFAULTS = {
  position: 'bottomright',
  precision: 3
};


var RectangleCoordinateView = L.Control.extend({

  initialize: function (options) {
    L.Util.setOptions(this, Util.extend({}, DEFAULTS, options));

    this._model = this.options.model || RectangleModel();
  },

  onAdd: function (map) {
    var container = this._container = document.createElement('div');
    container.classList.add(CLASS_NAME);

    this._map = map;

    this._north = container.appendChild(document.createElement('span'));
    this._north.classList.add(CLASS_NAME + '-north');

    this._west = container.appendChild(document.createElement('span'));
    this._west.classList.add(CLASS_NAME + '-west');

    this._east = container.appendChild(document.createElement('span'));
    this._east.classList.add(CLASS_NAME + '-east');

    this._south = container.appendChild(document.createElement('span'));
    this._south.classList.add(CLASS_NAME + '-south');

    this._model.on('change', this.render, this);
    this.render();

    return container;
  },

  onRemove: function () {
    this._model.off('change', this.render, this);

    this._north = null;
    this._south = null;
    this._east = null;
    this._west = null;

    this._map = null;

    this._container = null;
  },

  render: function () {
    var precision = this.options.precision,
        extent = this._model.get(),
        north,
        south,
        east,
        west;

    north = (extent.north!==null)?extent.north.toFixed(precision):'North';
    south = (extent.south!==null)?extent.south.toFixed(precision):'South';
    east = (extent.east!==null)?extent.east.toFixed(precision):'East';
    west = (extent.west!==null)?extent.west.toFixed(precision):'West';

    this._north.innerHTML = north;
    this._south.innerHTML = south;
    this._east.innerHTML = east;
    this._west.innerHTML = west;
  }
});

module.exports = RectangleCoordinateView;
