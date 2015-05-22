/**
 * @file CouchLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird')
var events = require('events').EventEmitter
var emitter = new events();

/**
 * Loads CouchDb models
 * @module CouchLoader
 */

module.exports = function(injector, options, logger){
  var opts = {
    url: options.couch.url,
    prefix: options.couch.prefix || 'pomegranate',
    persist: options.couch.persist
  }

  logger.log('Loading CouchDB models')
  var Couch = require('nano')(options.couch.url);
  var CouchAsync = Promise.promisifyAll(Couch.db);

  var CouchModels = {};
  var builtDbs = [];
  var modelCount = 0;
  var modelDir = path.join(options.models, 'couch');

  /**
   * Load up our model files, ready for further processing.
   */
  fs.readdirSync(modelDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0 && file !== 'index.js')
    })
    .forEach(function(file) {
      var fileName = file.split('.')[0].toLowerCase();
      var modelName = opts.prefix + '_' + fileName;

      var database = Promise.promisifyAll(Couch.use(modelName));
      var couchBase = Promise.promisifyAll(Couch);

      /**
       * Pass in the database context, as well as the refrence to the base couch connection.
       */
      var model = require(path.join(modelDir, file))(database, couchBase);
      logger.log('CouchLoader: Loaded model - ' + modelName)
      CouchModels[fileName] = model;
      modelCount += 1
      builtDbs.push(
        CouchAsync.getAsync(modelName)
          .spread(function(body){

            if(!opts.persist){
              logger.log('CouchLoader: Destroying ' + modelName + ' DB file.')
              return CouchAsync.destroyAsync(modelName)
                .spread(function(body) {
                  return CouchAsync.createAsync(modelName)
                    .spread(function(body) {
                      return afterCreate(database, model, modelName, fileName)
                    })
                })
            }
          })
          .catch(function(err) {
            if(err.message === 'no_db_file'){
              return CouchAsync.createAsync(modelName)
                .then(function(body) {
                  return afterCreate(database, model, modelName, fileName)
                })
            }
          })
      )
    });
  
  Promise.all(builtDbs).spread(function(m) {
    /**
     * Emit the ready to go function here.
     */
    emitter.emit('ready');
  })
  
  function afterCreate(db, model, name, viewName) {
    logger.log('CouchLoader: Created ' + name + ' DB file.')
    var vn = '_design/' + viewName
    return db.getAsync(vn)
      .spread(function(){
        return true
      })
      .catch(function(err) {
        return db.insertAsync({views: model.views}, vn)
      })
  }

  injector.service('Couch', _.extend(CouchModels, {Couch: Couch}))

  return emitter
};