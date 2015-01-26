'use strict';

var L = require('leaflet');

if (!L.Icon.Default.imagePath) {
  L.Icon.Default.imagePath = 'leaflet/images';
}

module.exports = L;