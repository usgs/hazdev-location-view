Location View Library
=====================

[![Build Status](https://travis-ci.org/usgs/hazdev-location-view.png)](https://travis-ci.org/usgs/hazdev-location-view)

Web library for getting location information from a user.

## Getting Started

TODO

## Building this Project

This project uses grunt for building. There are four different build
distributions available.

1. build
    1. Builds a minimal distribution. User must provide webutils and leaflet
       libraries manually.
2. build:leaflet
    1. Builds a distribution that bundles leaflet library, but user must
       webutils library manually.
    2. User must specify L.Icon.Default.imagePath
3. build:webutils
    1. Builds a distribution that bundles webutils library, but user must
       provide leaflet library manually.
4. build:all
    1. Builds a distribution with both leaflet and webutils libraries available.
    2. User must specify L.Icon.Default.imagePath

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