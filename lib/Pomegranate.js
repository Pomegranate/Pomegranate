/**
 * @file Pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var path = require('path');
var http = require('http');

var app = require('express')();
var verifyConfig = require('./Config');
var logger = require('./LogEmitter');
var injector = require('./DependencyManager');


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
  var expressConfig;

  /**
   * @private
   */
  var attemptStart = function(cb) {
    if(maxStartAttemts >= 1){
      if(_.every(dataServices, 'started', true)){
        this.log('DataHandlers: Data Service connections successful after ' + startAttempts + ' attempts.');
        this.log("Pomegranate: Server starting on " + instanceOptions.address + ':' + instanceOptions.port)
        server.listen(instanceOptions.port, instanceOptions.address, cb.bind(null, null));
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
  }.bind(this);

  /**
   * @method init
   * @memberof Pomegranate
   * @instance
   * @description Sets up the Pomegranate framework.
   * @param {Configuration} options - The main config object for Pomegranate.
   *
   * @example
   *
   * var options = {
     *  port: 8081,
     *  address: 0.0.0.0,
     *  session: {secret: 'asask...', ttl: 50000000 },
     *  redis: {host: 'localhost', port: 6379, password: null},
     *  sql: {
     *   database: "sqlite://data/",
     *   dialect: 'sqlite',
     *   storage: __dirname + '/data',
     *   logging: false
     *  },
     *  couch: {url: 'http://localhost:5984'}
     * }
   *
   * pomegranate.init(options)
   *
   *
   * @returns {Pomegranate} This instance.
   */
  this.init = function(options) {
    instanceOptions = verifyConfig(options);
    initialized = true;
    this.log("Pomegranate: Running setup.")
    injector.register('Logger', logger)

    /**
     *  Redis
     */
    if(instanceOptions.redis){
      var redisStatus = {started: false};
      dataServices.push(redisStatus);
      Redis = require('./RedisLoader')(instanceOptions, logger);
      injector.register('Redis', Redis);
      Redis.on('connect', function(){
        this.log('DataHandlers: Redis connection successful.')
        redisStatus.started = true
      }.bind(this))

      Redis.on('error', function(err){
        this.error(err)
      }.bind(this))
    }

    /**
     * Recursive authentication attempts to test connection to SQL server.
     * Sequelize is lazy and doesnt attempt to connect until a query is run.
     */

    if(instanceOptions.sql) {
      var sqlStatus = {started: false};
      dataServices.push(sqlStatus);
      SQL = require('./SQLoader')(instanceOptions, logger);
      injector.register('SQL', SQL);
      var trySQLauth = function(){
        SQL.sequelize.authenticate()
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
    if(options.couch){
      Couch = require('./CouchLoader')(options, logger);
    }
    expressConfig = require('./ExpressConfig')(app, options, Redis,  logger);
    return this
  };
  /**
   * Starts the Pomegranate server instance.
   * @method start
   * @memberof Pomegranate
   * @instance
   * @param callback
   * @returns {Pomegranate} this instance
   */
  this.start = function(callback) {
    started = true;
    if(initialized && instanceOptions) {

      var configuration = expressConfig.mountFirstMiddleware();
      var routes = require('./RouteLoader')(instanceOptions.routes, configuration, logger, SQL, Couch, injector);
      var lastMiddleware = expressConfig.mountLastMiddleware();
      server = http.createServer(lastMiddleware);

      /**
       *  Running this in a new stack so we can return from this function and attach
       *  any needed handlers before any log or error events happen.
       */
      setImmediate(function(){
        attemptStart(callback)
      })
      return this
    }
    callback('Cannot start server without running init first.')
    return this

  }
  /**
   * Adds a middleware function, or an array of middleware functions to the global middleware stack.
   * @method addMiddleware
   * @memberof Pomegranate
   * @instance
   * @returns {Pomegranate} this instance
   */
  this.addMiddleware = function(middleware){
    if(!started && initialized) {
      expressConfig.addMiddleware(middleware)
      return this
    }
    this.error(new Error('Cannot add middleware after server start.'))
    return this
  }
  /**
   * Registers a dependency to be made available to the injector.
   * @method addDependency
   * @memberof Pomegranate
   * @instance
   * @returns {Pomegranate} this instance
   */
  this.addDependency = function(name, item){
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
  }
}
/**
 *
 * @type {logger}
 */
Pomegranate.prototype = _.create(logger, {constructor: Pomegranate})


//function verifyConfig(opts){
//  return {
//    port: opts.port || 8080,
//    address: opts.address || '0.0.0.0',
//    session: opts.session || false,
//    staticFiles: opts.staticFiles || staticFiles,
//    routes: opts.routes || defaultRoutes,
//    models: opts.models || defaultModels,
//    redis: opts.redis || false,
//    sql: opts.sql || false,
//    couch: opts.couch || false
//  }
//}

/**
 * An unassuming framework for building web applications.
 * @module Pomegranate
 * @returns {Pomegranate}
 */

module.exports = new Pomegranate()