/* global require */
require([
  'RegionView'
], function (
  RegionView
) {
  'use strict';

  var _showRegionButton = document.querySelector('#showRegionView'),
      _regionResult = document.querySelector('#regionResult'),
      _onRegionCallback,
      _regionView;

  _onRegionCallback = function (region) {
    _regionResult.innerHTML = JSON.stringify(region, null, 2);
  };

  _regionView = RegionView({
    onRegionCallback: _onRegionCallback
  });

  _showRegionButton.addEventListener('click', function () {
    var region = null;

    try {
      region = JSON.parse(_regionResult.innerHTML);
    } catch (e) { /* No JSON. That's okay really... */ }

    _regionView.show({region: region});
  });

  _regionView.show();
});