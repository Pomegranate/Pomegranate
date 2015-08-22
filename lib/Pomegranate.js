/**
 * @file Pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var path = require('path');
var http = require('http');
var express = require('express');
var injector = require('magnum-di');
var chalk = require('chalk');
var app = express();
var verifyConfig = require('./Configuration/Config');
var logger = require('./Utilities/LogEmitter');
var VERSION = require(path.join(__dirname,'../','package.json')).version

var mainPath = path.dirname(require.main.filename);
var staticFiles = path.join(mainPath, 'public');
var defaultRoutes = path.join(mainPath, 'routes');
var defaultModels = path.join(mainPath, 'models');


/**
 * @class Pomegranate
 * @extends Logger
 * @listens Logger#log
 */
function Pomegranate(){
  var initialized = false;
  var started = false;
  var maxStartAttemts = 5;
  var startAttempts = 0;
  var dataServices = [];

  var server;
  var instanceOptions;
  var Redis;
  var SQL;
  var Couch;
  var Controllers;
  var expressConfig;
  var applicationRef;

  /**
   * @private
   */
  var attemptStart = function(cb) {
    if(maxStartAttemts >= 1){
      if(_.every(dataServices, 'ready', true)){
        this.log(chalk.green('DataHandlers: Data Service connections successful after ' + startAttempts + ' attempts.'));
        this.log(chalk.inverse.green('Pomegranate v'+ VERSION + ': Starting server on ' + instanceOptions.address + ':' + instanceOptions.port));
        server.listen(instanceOptions.port, instanceOptions.address, cb.bind(null, null));
        started = true;

      } else {
        this.log(chalk.yellow('DataHandlers: Waiting for connections. ' + (maxStartAttemts - 1) + ' Attempts left.'));
        setTimeout(function() {
          maxStartAttemts -= 1;
          startAttempts += 1;
          attemptStart(cb)
        }.bind(this), 200);
      }
    } else {
      this.error(chalk.red('Could not connect to services after 5 attempts.'));
      setImmediate(function() {
        process.exit();
      })

    }
  }.bind(this);

  /**
   * @method init
   * @memberof Pomegranate
   * @instance
   * @description Sets up the Pomegranate framework.
   * @param {Configuration} options - The main config object for Pomegranate.
   *
   * pomegranate.init(options)
   * @returns {Pomegranate} This instance.
   */
  this.init = function(options) {
    instanceOptions = verifyConfig(options);
    initialized = true;
    this.log(chalk.inverse.green('Pomegranate v'+ VERSION + ': Running setup.'));
    injector.service('Logger', logger);
    injector.factory('Router', express.Router);

    /**
     *  Redis
     */
    if(instanceOptions.redis){
      var redisStatus = {ready: false};
      dataServices.push(redisStatus);
      Redis = require('./DataServices/RedisLoader')(injector, instanceOptions, logger);
      Redis.on('ready', function(){
        redisStatus.ready = true
      });
    }
    /**
     * SQL
     */
    if(instanceOptions.sql) {
      var sqlStatus = {ready: false};
      dataServices.push(sqlStatus);
      SQL = require('./DataServices/SQLoader')(injector, instanceOptions, logger);
      SQL.on('ready', function() {
        sqlStatus.ready = true
      });
    }
    /**
     * Couch
     */
    if(instanceOptions.couch){
      var couchStatus = {ready: false}
      dataServices.push(couchStatus);
      Couch = require('./DataServices/CouchLoader')(injector, instanceOptions, logger);
      Couch.on('ready', function(){
        couchStatus.ready = true
      });
    }
    expressConfig = require('./Server/ExpressConfig')(app, instanceOptions, injector,  logger);

    return this
  };
  /**
   * Starts the Pomegranate server instance.
   * @method start
   * @memberof Pomegranate
   * @instance
   * @param {Pomegranate~startupCallback} callback
   * @returns {Pomegranate} this instance
   */

  /**
   * error will be encountered error if server failed to start.
   *
   * @callback Pomegranate~startupCallback
   * @param {Error} error
   */
  this.start = function(callback) {

    if(!_.isFunction(callback)){
      callback = function(){};
    }

    started = true;
    if(initialized && instanceOptions) {
      Controllers = require('./DataServices/ControllerLoader')(injector, instanceOptions, logger)
      Controllers.on('error', function(err){
        logger.error(err);
      });
      Controllers.on('ready', function() {
        /**
         * Attach pre route middleware first, including user defined middleware.
         */
        var loadedApp = expressConfig.mountFirstMiddleware();

        /**
         * Load routes.
         */
        loadedApp = require('./Server/RouteLoader')(instanceOptions.routes, loadedApp, injector);
        /**
         * Attach post route middleware, including error handlers.
         */
        loadedApp = expressConfig.mountLastMiddleware();

        loadedApp = expressConfig.configureExpress();
        applicationRef = loadedApp;
        server = http.createServer(loadedApp);

        /**
         *  Run this in a new stack so we can return from this function and attach
         *  any needed handlers before any log or error events happen.
         */
        var Deps = require('./DataServices/DependencyLoader')(injector, instanceOptions, logger);
        Deps.on('ready', function(){
          setImmediate(function(){
            attemptStart(callback)
          });
        });

      })

      return this
    }

    callback('Cannot start server without running init first.');
    return this

  };

  /**
   * Adds a middleware function, or an array of middleware functions to the global middleware stack.
   * @method addMiddleware
   * @memberof Pomegranate
   * @instance
   * @returns {Pomegranate} this instance
   */
  this.addMiddleware = function(middleware){
    if(!started && initialized) {
      expressConfig.addMiddleware(middleware);
      return this
    }
    this.error(new Error('Cannot add middleware after server start.'));
    return this
  };

  /**
   * Registers a dependency to be made available to the injector.
   * @method addDependency
   * @memberof Pomegranate
   * @instance
   * @returns {Pomegranate} this instance
   */
  this.addDependency = function(name, item, instance){
    if(!started){
      if(_.isString(name)){
        callAsDeterminer(name, item, instance)
      }
      if(_.isArray(name)){
        _.each(name, function(obj){
          if(_.isObject(obj) && _.isString(obj.name)){
            callAsDeterminer(obj.name, obj.item, obj.instance)
          }
        })
      }
      return this
    }
    this.error(new Error('Cannot add dependencies after server start.'));
    return this
  };
  //this.nuclearOption = function(){
  //  return applicationRef;
  //}

  /**
   * Returns the currently configured stack of default middleware.
   *
   * @method getDefaultMiddleware
   * @memberof Pomegranate
   * @instance
   * @returns {Function[]}
   */
  this.getDefaultMiddleware = function(){
    if(!started && initialized) {
      return expressConfig.getMiddleware();
    }
    this.error(new Error('Cannot add middleware after server start.'));
    return this
  };

  /**
   * Overrides the default stack of middlewares, returns Pomegranate instance for chaining.
   *
   * @method setDefaultMiddleware
   * @memberof Pomegranate
   * @instance
   * @param {Function[]} middleware
   * @returns {Pomegranate}
   */
  this.setDefaultMiddleware = function(middleware){
    if(!started && initialized) {
      expressConfig.setMiddleware(middleware);
      return this
    }
    this.error(new Error('Cannot set middleware after server start.'));
    return this
  };

  /**
   * Overrides the default stack of error handlers, returns Pomegranate instance for chaining.
   *
   * @method setErrorHandlers
   * @memberof Pomegranate
   * @instance
   * @param {Function[]} errorHandlers
   * @returns {Pomegranate}
   */
  this.setErrorHandlers = function(errorHandlers){
    if(!started && initialized) {
      expressConfig.setErrorHandlers(errorHandlers);
      return this
    }
    this.error(new Error('Cannot set Error Handlers after server start.'));
    return this
  };
}
/**
 *
 * @type {Logger}
 */
Pomegranate.prototype = _.create(logger, {constructor: Pomegranate});


/**
 * An unassuming framework for building web applications.
 * @module Pomegranate
 * @returns {Pomegranate}
 */

module.exports = new Pomegranate();


/*
 * Utility
 */
function callAsDeterminer(name, item, instance){
  if(_.isString(name)){
    if(_.isFunction(item)) {
      if(instance){
        injector.instance(name, item)
      } else {
        injector.factory(name, item)
      }

    } else {
      injector.service(name, item)
    }
  }
}