'use strict';

var config = require('./config');


var addMiddleware = function (connect, options, middlewares) {
  var bases,
      gateway;

  gateway = require('gateway');

  // push in reverse order
  bases = options.base.slice(0);
  bases.reverse();
  bases.forEach(function (base) {
    middlewares.unshift(gateway(base, {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    }));
  });

  middlewares.unshift(
    require('compression')({
      filter: function (req, res) {
        var type = res.getHeader('Content-Type');
        return (type+'').match(/(css|javascript)/);
      }
    }),
    require('grunt-connect-proxy/lib/utils').proxyRequest
  );

  return middlewares;
};


module.exports = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: config.templatePort,
      rewrite: {
        '^/theme': ''
      }
    }
  ],

  dev: {
    options: {
      port: config.examplePort,
      base: [
        config.example,
        config.build + '/' + config.src
      ],
      open: 'http://localhost:' + config.examplePort + '/example.php',
      liveReload: config.liveReloadPort,
      middleware: addMiddleware
    }
  },

  test: {
    options: {
      port: config.testPort,
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        'node_modules'
      ],
      open: 'http://localhost:' + config.testPort + '/test.html',
      middleware: addMiddleware
    }
  },

  dist: {
    options: {
      port: config.distPort,
      keepalive: true,
      base: [
        config.example,
        config.dist
      ],
      open: 'http://localhost:' + config.distPort + '/example.php',
      middleware: addMiddleware
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: config.templatePort
    }
  }
};
