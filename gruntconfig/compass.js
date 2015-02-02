'use strict';

var config = require('./config');

module.exports = {
  dev: {
    options: {
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      sassDir: config.src,
      specify: [
        config.src + '/LocationView.scss',
        config.src + '/RegionView.scss'
      ]
    }
  },
  example: {
    options: {
      cssDir: config.build + '/' + config.example + '/css',
      environment: 'development',
      importPath: [config.src, process.cwd() + '/node_modules/leaflet/dist'],
      sassDir: config.example + '/css'
    }
  }
};