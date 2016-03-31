Location View Library
=====================

[![Build Status](https://travis-ci.org/usgs/hazdev-location-view.png)](https://travis-ci.org/usgs/hazdev-location-view)

Web library for getting location information from a user.

## Getting Started

TODO

## Building this Project

This project uses grunt for building.

1. "grunt"
    1. Builds an unoptimized distribution in the ".build/src" folder.

1. "grunt dist"
    1. Builds an optimized distribution in the "dist" folder.

User must include leaflet library and css manually.  A version of leaflet is
placed in the "lib/leaflet-0.7.7" folder and can be included by adding a
link element for the stylesheet to the head before any custom styles,
and a script element for the javascript to the foot before any dependent scripts.


## License

Unless otherwise noted, This software is in the public domain because it
contains materials that originally came from the United States Geological
Survey, an agency of the United States Department of Interior. For more
information, see the official USGS copyright policy at
http://www.usgs.gov/visual-id/credit_usgs.html#copyright

Dependent libraries found are distributed under the open source (or open
source-like) licenses/agreements. Appropriate license aggrements for each
library can be found with the library content.

### Libraries used at runtime
 - Requirejs (http://requirejs.org/)
