'use strict';

var basePort = 8090;


module.exports = {
  build: '.build',
  dist: 'dist',
  distPort: basePort + 3,
  example: 'example',
  examplePort: basePort,
  liveReloadPort: basePort + 9,
  src: 'src',
  templatePort: basePort + 2,
  test: 'test',
  testPort: basePort + 1
};
