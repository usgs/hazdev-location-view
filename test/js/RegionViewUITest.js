/* global require */
require([
  'RegionView'
], function (
  RegionView
) {
  'use strict';

  var _showRegionButton = document.querySelector('#showRegionView'),
      _clearRegionButton = document.querySelector('#clearRegionView'),
      _north = document.querySelector('#north'),
      _south = document.querySelector('#south'),
      _east = document.querySelector('#east'),
      _west = document.querySelector('#west'),

      _inputs = document.querySelectorAll('input[type=text]'),
      _onRegionCallback,
      _onInputChange,
      _regionView;

  _onRegionCallback = function (region) {
    _north.value = region.get('north');
    _south.value = region.get('south');
    _east.value = region.get('east');
    _west.value = region.get('west');

    _onInputChange();
  };

  _onInputChange = function () {
    var empty = true;

    console.log('input:change');

    for (var i = 0, len = _inputs.length; i < len; i++) {
      // check for any non-null values
      if (_inputs[i].value !== '') {
        empty = false;
      }
    }

    if (empty) {
      _clearRegionButton.disabled = true;
    } else {
      _clearRegionButton.disabled = false;
    }
  };

  // Update based on intial values
  _onInputChange();

  // Initialize RegionView
  _regionView = RegionView({
    onRegionCallback: _onRegionCallback
  });

  // Event Bindings
  _north.addEventListener('input', _onInputChange);
  _south.addEventListener('input', _onInputChange);
  _east.addEventListener('input', _onInputChange);
  _west.addEventListener('input', _onInputChange);

  _clearRegionButton.addEventListener('click', function () {
    _north.value = '';
    _south.value = '';
    _east.value = '';
    _west.value = '';
    _clearRegionButton.disabled = true;
  });

  _showRegionButton.addEventListener('click', function () {
    var region = null,
        north,
        south,
        east,
        west;

    north = (_north.value === '') ? null : parseFloat(_north.value);
    south = (_south.value === '') ? null : parseFloat(_south.value);
    east = (_east.value === '') ? null : parseFloat(_east.value);
    west = (_west.value === '') ? null : parseFloat(_west.value);

    if (north === null &&south === null && east === null && west === null ) {
      _regionView.show({region: null});
    } else {
      region = {
        north: north,
        south: south,
        east:  east,
        west:  west
      };
      _regionView.show({region: region, type: 'rectangle'});
    }
  });
});