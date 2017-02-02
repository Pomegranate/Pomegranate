/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
'use strict';
/**
 *
 * @module index
 */
var Events = require('events').EventEmitter;
var path = require('path');
var util = require('util');
var _ = require('lodash');

var OptionsParser = require('./lib/OptionHandler');

//process.stdin.resume()

var Loader;
var instance;
/**
 *
 * @returns {Pomegranate|*}
 * @constructor
 */
function Pomegranate(FrameworkOptions, commandMode){
  if(!(this instanceof Pomegranate)) return new Pomegranate(FrameworkOptions, commandMode);
  Events.call(this);
  instance = this;
  this.commandMode = !!commandMode
  this.FrameworkOptions = FrameworkOptions;
  this.parentDirectory = process.cwd()
  this.pomegranateVersion = require('./package.json').version
  this.packageFile = path.join(this.parentDirectory, 'package.json');
  try{
    this.parentPkgJson = require(this.packageFile) || {};
  }
  catch(e) {
    this.parentPkgJson = {}
    console.log(e.message);
    throw e
  }
  this.layers = null;
  this.init()
}

util.inherits(Pomegranate, Events);

/**
 *
 * @param frameworkOptions
 * @param pluginOptions
 */
Pomegranate.prototype.init = function(){
  var self = this;
  var mergedOptions = OptionsParser.parseOptions(this.FrameworkOptions, this.parentDirectory);
  mergedOptions.wrapperVersion = this.pomegranateVersion
  mergedOptions.commandMode = this.commandMode
  // this.layers = mergedOptions.layers;
  Loader = require('magnum-loader')(this.parentPkgJson, mergedOptions);

  // Bind to all Loader events.
  Loader.on('ready', function(){
    self.ready = true
    self.emit('ready');
  })

  Loader.on('load', function() {
    self.loaded = true;
    self.emit('load');
  })

  Loader.on('start', function() {
    self.started = true;
    self.emit('start');
  })

  Loader.on('stop', function() {
    self.emit('stop')
    setImmediate(process.exit);
  });

  Loader.on('error', function(err){
    this.started = true;
    Loader.stop()
  })

  return this
}

Pomegranate.prototype.start = function(){
  if(this.ready){
    Loader.on('load', function(){
      Loader.start();
    })
    return Loader.load()
  }

  return setTimeout(function(){
    this.start()
  }.bind(this),250)
}

Pomegranate.prototype.stop = function(){
  if(this.started){
    return Loader.stop()
  }
  return setTimeout(function(){
    this.stop()
  }.bind(this),250)
}

Pomegranate.prototype.getLoader = function(){
  return Loader
}

Pomegranate.prototype.generateReport = function(){
  return Loader.generateReport()
};

Pomegranate.prototype.getDefaultConfigs = function(){
  return Loader.getPluginConfigs({defaults: true});
};

Pomegranate.prototype.getProvidedConfigs = function(){
  return {options: this.PluginOptions, path: this.pluginOptionsPath, parentDirectory: this.parentDirectory};
}

function HandleSignal(){
  if(instance){
    return instance.stop()
  }
  return setTimeout(function(){
    this.stop()
  }.bind(instance),250)
}

process.on('SIGHUP',  HandleSignal)
process.on('SIGINT',  HandleSignal)
process.on('SIGQUIT', HandleSignal)
process.on('SIGABRT', HandleSignal)
process.on('SIGTERM', HandleSignal)


module.exports = Pomegranate;