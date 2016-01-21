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

process.stdin.resume()

var Loader;
var instance;
/**
 *
 * @returns {Pomegranate|*}
 * @constructor
 */
function Pomegranate(FrameworkOptions){
  if(!(this instanceof Pomegranate)) return new Pomegranate(FrameworkOptions);
  Events.call(this);
  instance = this;
  this.FrameworkOptions = FrameworkOptions;
  this.parentDirectory = path.dirname((module.parent.filename));
  this.pluginOptionsPath = path.join(this.parentDirectory, FrameworkOptions.pluginOptions);
  this.packageFile = path.join(this.parentDirectory, 'package.json');
  try{
    this.parentPkgJson = require(this.packageFile) || {};
    this.PluginOptions = require(this.pluginOptionsPath)
  }
  catch(e) {
    console.log(e.message);
    throw e
  }
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

  Loader = require('magnum-loader')(this.parentPkgJson, mergedOptions, this.PluginOptions);

  Loader.on('ready', function(){
    self.ready = true
    Loader.load()
  })
  Loader.on('load', function() {
    self.loaded = true;
    self.emit('ready');
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
    console.log(err);
    this.started = true;
    Loader.stop()
  })
  return this
}

Pomegranate.prototype.start = function(){
  if(this.loaded){
    return Loader.start()
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

process.on('SIGINT', function() {
  if(instance){
    return instance.stop()
  }
  return setTimeout(function(){
    this.stop()
  }.bind(instance),250)
});

module.exports = Pomegranate;