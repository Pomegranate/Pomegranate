/**
 * @file ControllerLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var events = require('events').EventEmitter
var emitter = new events();

/**
 * Loads and registers controllers.
 * @module ControllerLoader
 */

module.exports = function(injector, options, logger) {
  var count = 0
  var controllerDir = path.join(options.controllers);

  logger.log('ControllerLoader: Loading Controllers from ' + controllerDir);
  fs.readdirSync(controllerDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0 && file !== 'index.js')
    })
    .forEach(function(file) {
      count += 1;
      var fileName = file.split('.')[0]
      var pendingInject = injector.inject(require(path.join(controllerDir, file)))
      injector.service(fileName, pendingInject)
      logger.log('ControllerLoader: Loaded ' + fileName + ' controller.');
    })

  logger.log('ControllerLoader: loaded ' + count + ' controllers.');
  setImmediate(function(){
    emitter.emit('ready');
  })

  return emitter
};