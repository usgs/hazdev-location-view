<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example Location View';
    $HEAD = '
      <link rel="stylesheet" href="css/example.css"/>
      <link rel="stylesheet" href="hazdev-location-view.css"/>
    ';
    $FOOT = '
      <script src="hazdev-location-view.js"></script>
      <script src="js/LocationViewExample.js"></script>
    ';
  }
  include '_example.inc.php';

?>

<button id="showLocationView">Show Location View</button>
<span id="locationResult" class="location-result">Results Shown Here</span>
