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
  logger.log('RouteLoader: Loading routes.');
  var loaded = 0;

  /**
   * checkIndexName - returns true for file matching acceptable filename for base route.
   * @param name
   * @returns {boolean}
   */
  var checkIndexName = function(name){
    return (name === 'index' || name === 'base' || name === 'main' || name === 'root');
  }

  /**
   * parseMountPath - Parses the route path filename, handling special cases for the bare route
   * directory as well as index files in sub directories.
   * @param basePath
   * @param includePath
   * @returns {string}
   */
  var parseMountPath = function(basePath, includePath) {
    var resolved = path.parse(path.relative(basePath, includePath));
    if(resolved.dir === ''){
      if(!checkIndexName(resolved.name)){
        logger.log('RouteLoader: Non default name used for base route file.')
      }
      return '/'
    }
    if(checkIndexName(resolved.name)){
      return ('/' + resolved.dir).toLowerCase()
    }
    return ('/' + resolved.dir + '/' + resolved.name).toLowerCase();
  }



  var loadIfFile = function(p) {
    fs.readdirSync(p).forEach(function(f) {
      var pendingIncludePath = path.join(p, f);
      var isDir = fs.statSync(pendingIncludePath).isDirectory();
      var notHidden = f.indexOf('.') !== 0;


      if(isDir && notHidden) {
        return loadIfFile(pendingIncludePath);
      }

      else if(notHidden) {
        var mPath = parseMountPath(routePath, pendingIncludePath)
        var route = require(pendingIncludePath)
        route = injector.inject(route);
        if(_.isObject(route)) {
          loaded += 1
          logger.log('RouteLoader: Loaded routes for ' + mPath)
          app.use(mPath, route)
        } else {
          logger.log('RouteLoader: Attempted to load invalid route file. \n'
          + 'Route modules must return a Router object.'
          )
        }

      }
    })
  };
  loadIfFile(routePath);
  logger.log('RouteLoader: Loaded ' + loaded + ' routes');


  return app

};

