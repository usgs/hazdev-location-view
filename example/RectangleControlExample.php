<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example for Rectangle Control';
    $HEAD = '
      <link rel="stylesheet" href="css/example.css"/>
      <link rel="stylesheet" href="hazdev-location-view.css"/>
    ';
    $FOOT = '
      <script src="hazdev-location-view.js"></script>
      <script src="js/RectangleControlExample.js"></script>
    ';
  }
  include '_example.inc.php';

?>

<div class="map"></div>
