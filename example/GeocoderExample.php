<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example Geocoder';
    $HEAD = '
      <link rel="stylesheet" href="lib/leaflet-0.7.7/leaflet.css"/>
      <link rel="stylesheet" href="hazdev-location-view.css"/>
    ';
    $FOOT = '
      <script src="lib/leaflet-0.7.7/leaflet.js"></script>
      <script src="hazdev-location-view.js"></script>
      <script src="js/GeocoderExample.js"></script>
    ';
  }
  include '_example.inc.php';

?>

<input aria-label="Address Fragment" placeholder="Address..." type="text"
    id="address"/>
<button id="forward">Geocode</button>

<hr/>

<input aria-label="Latitude" placeholder="Latitude" type="text"
    id="latitude"/>
<input aria-label="Longitude" placeholder="Longitude" type="text"
    id="longitude"/>
<button id="reverse">Reverse Geocode</button>

<hr/>

<pre id="output"></pre>
