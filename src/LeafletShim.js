'use strict';

var L = require('leaflet');

if (!L.Icon.Default.imagePath) {
  L.Icon.Default.imagePath = 'images';
}

module.exports = L;