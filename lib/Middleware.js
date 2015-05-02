/**
 * @file Middleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var fs = require('fs');
var responseTime = require('response-time');
var serveStatic = require('serve-static');
var compress = require('compression');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var favicon = require('serve-favicon');

/**
 * Manages middlewares.
 * @module Middleware
 */

module.exports = function(logger, redis){

  return {
    Session: function(opts){
      if(!opts){
        logger.log('ExpressConfig: Session Middleware not loaded.')
        return false
      }
      var using = 'MemoryStore';
      var baseTTL = 60 * 60 * 24 * 7;
      var options = {
        name: opts.name || 'silken.sid',
        secret: opts.secret || false,
        resave: opts.resave|| true,
        saveUninitialized: opts.saveUninitialized || false,
        cookie: {maxAge: opts.ttl * 1000 ||  baseTTL * 1000}
      }
      if(!options.secret){
        logger.log('ExpressConfig: Session Middleware not loaded, session.secret is required')
        return false
      }
      if(opts.secure){
        options.secure = true
      }
      if(redis){
        using = 'Redis';
        options.store = new RedisStore({
          client: redis,
          prefix: 'silken_sess:',
          ttl: opts.ttl || baseTTL
        })
      }
      logger.log('ExpressConfig: Session Middleware loaded.');
      logger.log('ExpressConfig: Session Middleware using ' + using + ' storage engine.')
      return session(options)
    },

    Static: function (opts){
      try {
        var staticFileDir = fs.statSync(opts)
      }
      catch (e){
        logger.log('ExpressConfig: Static Middleware not loaded, path does not exist, or is not a directory.')
        return false
      }
      if(staticFileDir.isDirectory()) {
        logger.log('ExpressConfig: Static Middleware loaded.');
        logger.log('ExpressConfig: Serving static files from ' + opts);
        return serveStatic(opts)
      }
      logger.log('ExpressConfig: Static Middleware not loaded, path does not exist, or is not a directory.')
      return false
    },

    Compression: function(options){
      logger.log('ExpressConfig: Compression Middleware loaded.')
      return compress()
    },


    ResponseTime: function(options){
      logger.log('ExpressConfig: ResponseTime Middleware loaded.')
      return responseTime()
    },

    Logger: function(options) {
      logger.log('ExpressConfig: Logging Middleware loaded.')
      return morgan(function(t, req, res) {
        var resObj = {
          "remote-addr": t['remote-addr'](req, res),
          "remote-user": t['remote-user'](req, res),
          "date": t['date'](req, res),
          "method": t['method'](req, res) + ' ' + t['url'](req, res) + 'HTTP/' + t['http-version'](req, res),
          "status": t['status'](req, res),
          "content-length": res['content-length'],
          "response-time": t['response-time'](req, res) + 'ms'
        };
        var resString = _.map(resObj, function(d) {
          return d
        }).join(' ');
        logger.requestHandled(resString, resObj)
      })
    },

    BodyParser: function(options) {
      logger.log('ExpressConfig: BodyParser Middleware loaded.')
      return bodyParser.json()
    }
  }
}