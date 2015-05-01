/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Silken
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * Main export for Silken
 * @module index
 */

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

var logger = require('./lib/LogEmitter');

var Silken = (function() {
  function Silken(){

    var attemptStart = function(cb){
      if(this.maxAttempts >= 1){

        if(_.every(this.dataServices, 'started', true)){
          this.log('DataHandlers: Data Service connections successful after ' + this.attempts + ' attempts.');
          this.log("Silken: Server starting on " + this.options.address + ':' + this.options.port)
          this.server.listen(this.options.port, this.options.address, cb.bind(null, null));
          this.started = true;

        } else {
          this.log('DataHandlers: Waiting for connections. ' + (this.maxAttempts - 1) + ' Attempts left.')
          setTimeout(function() {
              this.maxAttempts -= 1;
              this.attempts += 1;
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

    this.initialized = false;
    this.started = false;
    this.maxAttempts = 5;
    this.attempts = 0;
    this.dataServices = [];

    this.init = function(opts){

      this.options = verifyConfig(opts);
      this.initialized = true;
      this.log("Silken: Running setup.")

      /**
       *  Redis
       */
      if(this.options.redis){
        var redisStatus = {started: false};
        this.dataServices.push(redisStatus);
        this.Redis = require('./lib/RedisLoader')(this.options, logger);

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
        this.dataServices.push(sqlStatus);
        this.SQL = require('./lib/SQLoader')(this.options, logger);
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
        this.Couch = require('./lib/CouchLoader')(this.options, logger);
      }
      this.expressConfig = require('./lib/ExpressConfig')(app, this.options, this.Redis,  logger);
      return this
    };

    this.addMiddleware = function(mw){
      if(!this.started && this.initialized) {
        this.expressConfig.addMiddleware(mw)
        return this
      }
      this.error(new Error('Cannot add middleware after server start.'))
      return this
    };

    this.start = function(cb){
      if(this.initialized && this.options) {
        var configuration = this.expressConfig.mountFirstMiddleware();
        var routes = require('./lib/RouteLoader')(this.options.routes, configuration, logger, this.SQL, this.Couch);
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
      return cb('Cannot start server without running init first.')
    };
  }
  Silken.prototype = _.create(logger, {
    constructor: Silken
  })
  return Silken
})();


module.exports = new Silken();

/**
 * Utility and validation.
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
