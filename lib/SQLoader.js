/**
 * @file SQLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Silken
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var Sequelize = require('sequelize');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
/**
 * Loads SQL models.
 * @module SQLoader
 */

module.exports = function(options, logger) {
  logger.log('SQLoader: Loading SQL models.')
  var db = {}
  var modelCount = 0;
  var dbOptions = {
    database: options.sql.database || logger.error(new Error('Database not provided to SQLoader.')),
    username: options.sql.username || null,
    password: options.sql.password || null,
    dialect: options.sql.dialect || logger.error(new Error('Dialect not provided to SQLoader.')),
    storage: options.sql.storage || null,
    logging: options.sql.logging || false
  }


  var sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password,  dbOptions)
  var modelDir = path.join(options.models, 'sql');
  fs.readdirSync(modelDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0 && file !== 'index.js')
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(modelDir, file));
      logger.log('SQLoader: Loaded model - ' + model.name)
      db[model.name] = model;
      modelCount += 1
    })
  
  _.each(db, function(model) {
    if(typeof model.associate === "function"){
      model.associate(db)
      //model.sync();
    }
  })
  
  logger.log('SQLoader: Loaded ' + modelCount + ' Sql models.' )


  return  _.extend({
    Seqelize: Sequelize,
    sequelize: sequelize
  }, db);
};

