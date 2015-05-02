/**
 * @file ExpressConfig
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
 * Exports Express configuration options.
 * @module ExpressConfig
 */

module.exports = function expressConfig(app, options, redis, logger) {
  logger.log('ExpressConfig: Loading Express Configuration.')

  var middleware = require('./Middleware')(logger, redis);
  var first = [
    middleware.Compression(options),
    middleware.ResponseTime(options),
    middleware.Static(options.staticFiles),
    middleware.Session(options.session),
    middleware.Logger(options),
    middleware.BodyParser(options.bodyParser)

  ];
  var last = [
    function notFound(req, res, next) {
      res.status(404)
      res.json({err: 'not found'});
    },
    function fiveHundred(err, req, res, next){
      logger.error(err)
      res.status(err.status || 500);
      res.json({err: err.stack});
    }
  ];

  return {
    addMiddleware: function(mw){
      if(_.isFunction(mw)) {
        first.push(mw);
      }
      else if(_.isArray(mw)){
        _.each(mw, function(mwf){
            if(_.isFunction(mwf)){
              first.push(mwf)
            } else {
              logger.error(new Error('ExpressConfig - attempting to register ' + mwf.constructor + ' as middleware function.'))
            }
        })
      }
    },

    mountFirstMiddleware: function() {
      _.each(first, function(mw) {
        if(_.isFunction(mw)){
          app.use(mw)
        }
      });
      return app
    },

    mountLastMiddleware: function() {
      _.each(last, function(mw) {
        if(_.isFunction(mw)){
          app.use(mw)
        }
      });
      return app
    }

  }
};

