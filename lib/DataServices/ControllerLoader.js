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

  var controllerDir = path.join(options.controllers);

  logger.log('ControllerLoader: Loading Controllers from ' + controllerDir);
  fs.readdir(controllerDir, function(err, files) {
    var count = 0

    if(err){
      if(err.code === 'ENOENT'){
        logger.log('ControllerLoader: No controllers loaded.')

      } else {
        emitter.emit('error', err)
      }

      return emitter.emit('ready');
    }

    files
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
    if(count > 0) {
      logger.log('ControllerLoader: loaded ' + count + ' controllers.');
    }

    emitter.emit('ready');
  });


  return emitter
};