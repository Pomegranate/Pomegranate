/**
 * @file Pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
"use strict";
var options = null;
var initilized = false;
var _ = require('lodash');
var path = require('path');
var app = require('express')();
var http = require('http');
var mainPath = path.dirname(require.main.filename);
var staticFiles = path.join(mainPath, 'public');
var defaultRoutes = path.join(mainPath, 'routes');
var defaultModels = path.join(mainPath, 'models');

var logger = require('./LogEmitter');
var injector = require('./DependencyManager');

/**
 * Pomegranate - An unassuming framework for building apps.
 * @module
 * @typicalname Pomegranate
 */

var Pomegranate = (function() {

  var initialized = false;
  var started = false;
  var maxStartAttemts = 5;
  var startAttempts = 0;
  var dataServices = [];


  function Pomegranate(){

    var attemptStart = function(cb){
      if(maxStartAttemts >= 1){

        if(_.every(dataServices, 'started', true)){
          this.log('DataHandlers: Data Service connections successful after ' + startAttempts + ' attempts.');
          this.log("Pomegranate: Server starting on " + this.options.address + ':' + this.options.port)
          this.server.listen(this.options.port, this.options.address, cb.bind(null, null));
          started = true;

        } else {
          this.log('DataHandlers: Waiting for connections. ' + (maxStartAttemts - 1) + ' Attempts left.')
          setTimeout(function() {
            maxStartAttemts -= 1;
            startAttempts += 1;
            attemptStart(cb)
          }.bind(this), 200);
        }
      } else {
        this.error('Could not connect to services after 5 attempts.');
        setImmediate(function() {
          process.exit();
        })

      }

    }.bind(this)

    /**
     * @method init
     * @param {Object} opts options object.
     * @returns {Pomegranate}
     */
    this.init = function(opts){

      this.options = verifyConfig(opts);
      initialized = true;
      this.log("Pomegranate: Running setup.")
      injector.register('Logger', logger)

      /**
       *  Redis
       */
      if(this.options.redis){
        var redisStatus = {started: false};
        dataServices.push(redisStatus);
        this.Redis = require('./RedisLoader')(this.options, logger);
        injector.register('Redis', this.Redis);
        this.Redis.on('connect', function(){
          this.log('DataHandlers: Redis connection successful.')
          redisStatus.started = true
        }.bind(this))

        this.Redis.on('error', function(err){
          this.error(err)
        }.bind(this))

      }

      /**
       *
       *  Recursive authentication attempts to test connection to SQL server.
       *  Sequelize is lazy and doesnt attempt to connect until a query is run.
       *
       */
      if(this.options.sql) {
        var sqlStatus = {started: false};
        dataServices.push(sqlStatus);
        this.SQL = require('./SQLoader')(this.options, logger);
        injector.register('SQL', this.SQL);
        var trySQLauth = function(){
          this.SQL.sequelize.authenticate()
            .then(function(){
              this.log('DataHandlers: SQL connection successful.')
              sqlStatus.started = true
            }.bind(this))
            .catch(function(err){
              this.error(err)
              setTimeout(function(){
                trySQLauth()
              }.bind(this), 200)
            }.bind(this))
        }.bind(this)

        trySQLauth()
      }
      if(this.options.couch){
        this.Couch = require('./CouchLoader')(this.options, logger);
        this.dependencies.Couch = this.Couch
      }
      this.expressConfig = require('./ExpressConfig')(app, this.options, this.Redis,  logger);
      return this
    };

    /**
     * @method registerMiddleware
     *
     * @param {(function[]|function)} middleware
     * @returns {Pomegranate} Returns the current Pomegranate instance.
     *
     * @example
     * // Accepts a single function.
     *
     * pomegranate.registerMiddleware(function(req, res, next){
     *  //do something
     *  next()
     * }
     *
     * @example
     * pomegranate.registerMiddleware([
     *  function(req, res, next){next()},
     *  function(req, res, next){next()},
     *  function(req, res, next){next()}
     * ])
     *
     */
    this.registerMiddleware = function(middleware){
      if(!started && initialized) {
        this.expressConfig.addMiddleware(middleware)
        return this
      }
      this.error(new Error('Cannot add middleware after server start.'))
      return this
    };
    /**
     * @method registerDependency
     *
     * @param {string} name - The name to register with the Injector.
     * @param {Object[]} name - an array of objects to register
     * @param {string} name[].name - The name to register with the Injector.
     * @param {Object} name[].item - The dependency that will be returned for name[].name
     * @param {Object} item - The dependency that will be returned for {name}
     * @returns {Pomegranate}
     *
     * @example
     * //Accepts a name and an object to inject
     *
     * pomegranate.registerDependency('MyDatabase', returnMyDatabase())
     *
     * @example
     * //Accepts an array of objects representing the objects to register with the injector.
     *
     * pomegranate.registerDependency([
     *  {name: 'MyDB', returnMyDB()},
     *  {name: 'StaticData', {a: 10, b: 20}}
     * ])
     */
    this.registerDependency = function(name, item){
      if(!started){
        if(_.isString(name)){
          injector.register(name, item);
        }
        if(_.isArray(name)){
          _.each(name, function(obj){
            if(_.isObject(obj)){
              injector.register(obj.name, obj.item)
            }
          })
        }
        return this
      }
      this.error(new Error('Cannot add dependencies after server start.'))
      return this
    };
    /**
     * @method start - Starts the configured express server instance.
     * @param {function} cb - Function to be called on successful server start.
     * @returns {Pomegranate}
     */
    this.start = function(cb){
      started = true;
      if(initialized && this.options) {

        var configuration = this.expressConfig.mountFirstMiddleware();
        var routes = require('./RouteLoader')(this.options.routes, configuration, logger, this.SQL, this.Couch, injector);
        var lastMiddleware = this.expressConfig.mountLastMiddleware();
        this.server = http.createServer(lastMiddleware);

        /**
         *  Running this in a new stack so we can return from this function and attach
         *  any needed handlers before any log or error events happen.
         */
        setImmediate(function(){
          attemptStart(cb)
        })
        return this
      }
      cb('Cannot start server without running init first.')
      return this
    };
  }
  Pomegranate.prototype = _.create(logger, {
    constructor: Pomegranate
  })
  return Pomegranate
})();


module.exports = new Pomegranate();

/**
 * Utility and validation.
 *
 */

function verifyConfig(opts){
  return {
    port: opts.port || 8080,
    address: opts.address || '0.0.0.0',
    session: opts.session || false,
    staticFiles: opts.staticFiles || staticFiles,
    routes: opts.routes || defaultRoutes,
    models: opts.models || defaultModels,
    redis: opts.redis || false,
    sql: opts.sql || false,
    couch: opts.couch || false
  }
}
