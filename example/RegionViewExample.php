<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example for Region View';
    $HEAD = '
      <link rel="stylesheet" href="lib/leaflet-0.7.7/leaflet.css"/>
      <link rel="stylesheet" href="css/example.css"/>
      <link rel="stylesheet" href="hazdev-location-view.css"/>
    ';
    $FOOT = '
      <script src="lib/leaflet-0.7.7/leaflet.js"></script>
      <script src="hazdev-location-view.js"></script>
      <script src="js/RegionViewExample.js"></script>
    ';
  }
  include '_example.inc.php';

?>

<button id="showRegionView">Show Region View</button>
<button id="clearRegionView" disabled>Clear Region View</button>
<br/>


<h2>Rectangle Coordinates</h2>
<label for="north">North
  <input type="text" id="north" value="52"/>
</label>

<label for="south">South
  <input type="text" id="south" value="23"/>
</label>

<label for="east">East
  <input type="text" id="east" value="-62"/>
</label>

<label for="west">West
  <input type="text" id="west" value="-130"/>
</label>
