/* global alert */
'use strict';

var Geocoder = require('locationview/Geocoder');

var g = new Geocoder(),
    a = document.querySelector('#address'),
    y = document.querySelector('#latitude'),
    x = document.querySelector('#longitude'),
    o = document.querySelector('#output'),
    b1 = document.querySelector('#forward'),
    b2 = document.querySelector('#reverse');

var onSuccess = function (loc) {
  o.innerHTML = JSON.stringify(loc, null, '  ');
  a.value = loc.place;
  x.value = loc.longitude;
  y.value = loc.latitude;
};

var onFailure = function (status, error) {
  o.innerHTML = '';
  alert(error);
};

var forward = function (/*evt*/) {
  x.value = '';
  y.value = '';
  g.forward(a.value, onSuccess, onFailure);
};

var reverse = function (/*evt*/) {
  a.value = '';
  g.reverse(y.value, x.value, onSuccess, onFailure);
};

var __get_keyup = function (callback) {
  return function (evt) {
    if (evt.keyCode === 13) {
      callback(evt);
    }
  };
};

a.addEventListener('keyup', __get_keyup(forward));
b1.addEventListener('click', forward);

y.addEventListener('keyup', __get_keyup(reverse));
x.addEventListener('keyup', __get_keyup(reverse));
b2.addEventListener('click', reverse);