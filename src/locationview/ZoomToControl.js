/* global L */
'use strict';
var Util = require('util/Util');

var CLASS_NAME = 'location-zoomto-control';

var DEFAULTS = {
  'locations': [
      {
        title:'World',
        bounds:[[70,20],[-70,380]]
      },
      {
        title:'U.S.',
        bounds:[[50,-125], [24.6,-65]]
      }
    ],
  'position': 'topleft'
};

/**
 * ZoomToControl
 *    A control that zooms to a specific region on the map.
 *
 * @params
 *    options: {object}
 *      locations: array of objects
 *        object:
 *          title: string
 *          bounds: array
 */
var ZoomToControl = L.Control.extend({
  include: L.Mixin.Events,

  initialize: function (options) {
    L.Util.setOptions(this, L.Util.extend({}, DEFAULTS, options));
  },

  /**
   * onAdd Add the select element and container to the map
   *
   * @params map {leaflet.map}
   */
  onAdd: function (map) {
    var options = this.options,
        container,
        locations,
        option,
        select;

    locations = options.locations;

    container = document.createElement('div');
    container.classList.add('zoomto-control');
    container.classList.add(CLASS_NAME);
    //Add Select element
    select = document.createElement('select');
    select.classList.add(CLASS_NAME + '-list');
    container.appendChild(select);
    // Create default option (Zoom To)
    option = document.createElement('OPTION');
    option.text = 'Zoom to...';
    option.value = 'jump';
    select.options.add(option);
    // Add all options from locations.
    for(var i = 0; i < locations.length; ++i) {
        option = document.createElement('OPTION');
        option.text = locations[i].title;
        option.value = locations[i].title;
        select.options.add(option);
      }

    this._container = container;
    this._map = map;

    //Disable propagation for old style mouse/touch
    //Includes ie11
    L.DomEvent.disableClickPropagation(container);

    //Disable propagation for ie11/microsoft touch
    L.DomEvent
      .on(select, 'change', this._setZoom, this)
      .on(select, 'pointerdown', this._onAddPointerDownEvent, this);

    return container;
  },

  /**
   * On Add Pointer Down Event
   *
   * @params e {event}
   *
   * @notes Changed from an inline function, to a seperate function for
   *    removeListener to work.
   */
  _onAddPointerDownEvent: function (e) {
    var evt = e ? e : window.event;
        evt.returnValue = false;
        evt.cancelBubble = true;
    },

  /**
   * onRemove
   *    Removes listeners from dom.
   */
  onRemove: function () {
    var container,
        map,
        select;

    container = this._container;
    map = this._map;
    select = container.querySelector('.' + CLASS_NAME +'-list');

    L.DomEvent.removeListener(select, 'change', this._setZoom);
    L.DomEvent.removeListener(select, 'pointerdown',
        this._onAddPointerDownEvent);

    this._container = null;
    this._map = null;
  },

  /**
   * Set the zoom extents
   *    triggered by a change event.
   *
   * @params e {event}
   *    selectedIndex: the index of the selected item
   */
  _setZoom: function(e) {
    var index;

    e = Util.getEvent(e);
    index = e.target.selectedIndex;

    this._map.fitBounds(this.options.locations[index -1].bounds);

    // Set the set box back to Zoom to
    e.target.selectedIndex = 0;
  }

});

module.exports = ZoomToControl;
