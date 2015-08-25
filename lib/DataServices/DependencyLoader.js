/**
 * @file ControllerLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var events = require('events').EventEmitter
var emitter = new events();

/**
 * Loads Dependencies through the injector
 * @module Dependency Loader
 */

module.exports = function(injector, options, logger) {

  var dependencyDir = path.join(options.dependencies);

  logger.log(chalk.green('DependencyLoader: Loading dependencies from ' + dependencyDir));
  fs.readdir(dependencyDir, function(err, files) {
    var count = 0

    if(err){
      if(err.code === 'ENOENT'){
        logger.log(chalk.yellow('DependencyLoader: No dependencies loaded.'));

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
        var pendingInject = injector.inject(require(path.join(dependencyDir, file)))

        //If our module returns a value, add it to the injector.
        if(pendingInject) {
          logger.log(chalk.green('DependencyLoader: ' + fileName + ' dependency added to dependencies object.'));
          injector.service(fileName, pendingInject)
        }
        logger.log(chalk.green('DependencyLoader: Loaded ' + fileName + ' dependency.'));
      })
    if(count > 0) {
      logger.log(chalk.green('DependencyLoader: loaded ' + count + ' dependency'));
    }

    emitter.emit('ready');
  });


  return emitter
};