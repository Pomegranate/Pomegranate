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
const path = require('path');
const OptionsParser = require('./lib/OptionHandler')
const Framework = require('@pomegranate/framework')
const PomModules = require('@pomegranate/common-modules')

const semver = require('semver')
const nodeVersion = process.version
const cantRun = !semver.satisfies(nodeVersion, `>=7.6.0`)


if(cantRun){
  throw new Error('Pomegranate v6.x and higher requires NodeJS v7.6.0 at a minimum.')
  process.exit(1)
}


/**
 *
 * @returns {Pomegranate|*}
 * @constructor
 */

function Pomegranate6(FrameworkOptions, CommandMode){
  let Framework = PomModules.Framework.module
  let Pom = new Framework(PomModules)
  let workingDirectory = process.cwd()
  let packageFile = require(path.join(workingDirectory, 'package.json'))

  let mergedOptions = OptionsParser.parseOptions(FrameworkOptions, workingDirectory);
  // mergedOptions.wrapperVersion = this.pomegranateVersion
  // mergedOptions.commandMode = this.commandMode

  let handled = false

  function HandleSignal(signal){
    return function(err){
      if(handled) { return }
      handled = true
      if(err){
        Pom.logMessage(err, 'error')
      }
      Pom.logMessage(`Caught ${signal}, stopping Pomegranate gracefully.`)
      if(Pom){
        return Pom.stop()
          .then((r) => {
            return Pom.shutdown()
          })
      }
      return setTimeout(function(){
        Pom.stop()
          .then((r) => {
            return Pom.shutdown()
          })
      },250)
    }
  }

  process.on('beforeExit', () => {
    if(handled) { return }
    handled = true
    Pom.logMessage('Event loop empty, exiting.')
    Pom.stop()
      .then(() => {
        Pom.shutdown()
      })
  })

  process.on('SIGHUP',  HandleSignal('SIGHUP'))
  process.on('SIGINT',  HandleSignal('SIGINT'))
  process.on('SIGQUIT', HandleSignal('SIGQUIT'))
  process.on('SIGABRT', HandleSignal('SIGABRT'))
  process.on('SIGTERM', HandleSignal('SIGTERM'))
  process.on('uncaughtException', HandleSignal('UncaughtException'))

  Pom.on('lateError', HandleSignal('LATEERROR'))

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
        return Pom.shutdown()
      })
    },
    on: function(handler, fn){
      Pom.on(handler, fn)
    }
  }
}

module.exports = Pomegranate6