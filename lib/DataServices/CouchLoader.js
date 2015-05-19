/**
 * @file CouchLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var fs = require('fs');
var path = require('path');

/**
 * Loads CouchDb models
 * @module CouchLoader
 */

module.exports = function(options, logger){
  logger.log('Loading CouchDB models')
  var Couch = require('nano')(options.couch.url)
  var CouchModels = {};
  var modelCount = 0;
  var modelDir = path.join(options.models, 'couch');
  fs.readdirSync(modelDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0 && file !== 'index.js')
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(modelDir, file));
      logger.log('CouchLoader: Loaded model - ' + model.name)
      CouchModels[model.name] = model;
      modelCount += 1
    })

  return CouchModels
};