<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example for Location Control';
    $HEAD = '
      <link rel="stylesheet" href="lib/leaflet-0.7.7/leaflet.css"/>
      <link rel="stylesheet" href="css/example.css"/>
      <link rel="stylesheet" href="hazdev-location-view.css"/>
    ';
    $FOOT = '
      <script src="lib/leaflet-0.7.7/leaflet.js"></script>
      <script src="hazdev-location-view.js"></script>
      <script src="js/LocationControlExample.js"></script>
    ';
  }
  include '_example.inc.php';

?>

<div class="map"></div>
