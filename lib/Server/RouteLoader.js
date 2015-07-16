/**
 * @file RouteLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Router = require('express').Router

/**
 * Loads routes for the express server.
 * @module RouteLoader
 */

module.exports = function routeLoader(routePath, app, injector) {
  var logger = injector.get('Logger');
  logger.log('RouteLoader: Loading routes.')
  var loaded = 0;
  var loadIfFile = function(p) {
    fs.readdirSync(p).forEach(function(f) {
      var pendingIncludePath = path.join(p, f);
      var isDir = fs.statSync(pendingIncludePath).isDirectory();
      var notHidden = f.indexOf('.') !== 0;


      if(isDir && notHidden) {
        return loadIfFile(pendingIncludePath);
      }

      else if(notHidden) {
        parseMountPath(path.relative(routePath, pendingIncludePath))
        var route = require(pendingIncludePath)
        route = injector.inject(route);
        if(_.isObject(route)) {
          loaded += 1
          logger.log('RouteLoader: Loaded routes for ' + route.path)
          app.use(route.path, route.router)
        } else {
          logger.log('RouteLoader: Attempted to load invalid route file. \n'
          + 'Route modules must return an object.'
          )
        }

      }
    })
  };
  loadIfFile(routePath);
  logger.log('RouteLoader: Loaded ' + loaded + ' routes');


  return app

};

function parseMountPath(resolved){
  console.log(path.parse(resolved));
};