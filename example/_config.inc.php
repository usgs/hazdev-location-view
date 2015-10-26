<?php

// site search url, leave blank for all usgs
$SITE_URL = 'earthquake.usgs.gov';

// navigation above search, below section navigation
$SITE_SITENAV =
  '<a href="#earthquakes">Earthquakes</a>' .
  '<a href="#hazards">Hazards</a>' .
  '<a href="#data">Data</a>' .
  '<a href="#learn">Learn</a>' .
  '<a href="#monitoring">Monitoring</a>' .
  '<a href="#research">Research</a>';

// at bottom of page
$SITE_COMMONNAV =
  navItem('#home', 'Home') .
  navItem('#aboutus', 'About Us') .
  navItem('#contactus/regional.php', 'Contact Us') .
  navItem('#legal.php', 'Legal');

$HEAD =
// site theme, should use a site root-relative URL
  '<link rel="stylesheet" href="/theme/site/earthquake/index.css"/>' .
// page head content
  ($HEAD ? $HEAD : '');

?>
