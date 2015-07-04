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
var jade = require('jade');

/**
 * Exports Express configuration options.
 * @module ExpressConfig
 */

module.exports = function expressConfig(app, options, injector, logger) {
  logger.log('ExpressConfig: Loading Express Configuration.')
  var redis = injector.get('Redis')
  var middleware = require('./Middleware')(logger, redis);
  var first = [
    middleware.Compression(options),
    middleware.ResponseTime(options),
    middleware.Favicon(options.staticFiles),
    middleware.Static(options.staticFiles),
    middleware.Session(options.session),
    middleware.Logger(options),
    middleware.BodyParser(options.bodyParser)

  ];

  /**
   * Return error handlers based on the renderErrors option variable.
   */
  var last = (function() {
    if(options.renderErrors){
      return [
        function renderNotFound(req, res, next){

          res.status(404);
          res.render('errors/404', function(err, html){
            if(err){
              logger.error(err);
              logger.error('Please make sure to include error templates in ./views/errors');
              return res.end("404 - Page Not Found");
            }
            return res.end(html);
          });
        },
        function renderFiveHundred(err, req, res, next){
          logger.error(err)
          res.status(err.status || 500);
          res.render('errors/500', function(err, html) {
            if(err){
              logger.error(err);
              logger.error('Please make sure to include error templates in ./views/errors');
              return res.end("500 - Internal server error.")
            }
            return res.end(html);
          });
        }
      ]
    }
    return [
      function notFound(req, res, next) {
        res.status(404)
        res.json({err: 'not found'});
      },
      function fiveHundred(err, req, res, next){
        logger.error(err)
        res.status(err.status || 500);
        res.json({err: "there has been an unrecoverable error"});
      }
    ];
  })();

  return {
    addMiddleware: function(mw) {
      if(_.isFunction(mw)) {
        first.push(mw);
      }
      else if(_.isArray(mw)) {
        _.each(mw, function(mwf) {
          if(_.isFunction(mwf)) {
            first.push(mwf)
          }
          else {
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
    },
    configureExpress: function(){
      if(options.templating === 'hbs'){
        var hbs = require('hbs');
        hbs.registerPartials(options.partials);
      }
      app.set('views', options.views)
      app.set('view engine', options.templating)

      return app
    }
  }
};

