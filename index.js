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


let Framework = require('@pomegranate/framework')
/**
 *
 * @returns {Pomegranate|*}
 * @constructor
 */

function Pomegranate6(FrameworkOptions, CommandMode){

  let Pom = new Framework()
  let workingDirectory = process.cwd()
  let packageFile = require(path.join(workingDirectory, 'package.json'))

  let mergedOptions = OptionsParser.parseOptions(FrameworkOptions, workingDirectory);
  // mergedOptions.wrapperVersion = this.pomegranateVersion
  // mergedOptions.commandMode = this.commandMode

  function HandleSignal(signal){
    return function(err){
      if(err){
        console.log(err)
      }
      Pom.logMessage(`Caught ${signal}, stopping Pomegranate gracefully.`)
      if(Pom){
        return Pom.stop()
      }
      return setTimeout(function(){
        Pom.stop()
      },250)
    }
  }

  process.on('SIGHUP',  HandleSignal('SIGHUP'))
  process.on('SIGINT',  HandleSignal('SIGINT'))
  process.on('SIGQUIT', HandleSignal('SIGQUIT'))
  process.on('SIGABRT', HandleSignal('SIGABRT'))
  process.on('SIGTERM', HandleSignal('SIGTERM'))
  process.on('uncaughtException', HandleSignal('UncaughtException'))

  return {
    start: function() {
      Pom.on('stopped', () => {
        setTimeout(process.exit.bind(0), 500)
      })
      return Pom.initialize({packageJSON: packageFile, frameworkOptions: mergedOptions})
        .then(() => {
          return Pom.configure()
        })
        .then(() => {
          return Pom.load()
        })
        .then(() => {
          return Pom.start()
        })
    },
    stop: function() {
      return Pom.stop().then((r) => {
        return r
      })
    },
    on: function(handler, fn){
      Pom.on(handler, fn)
    }
  }
}

module.exports = Pomegranate6