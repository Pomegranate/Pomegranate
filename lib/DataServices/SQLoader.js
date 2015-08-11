/**
 * @file SQLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var Sequelize = require('sequelize');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Events = require('events').EventEmitter
var emitter = new Events();
/**
 * Loads SQL models.
 * @module SQLoader
 */

module.exports = function(injector, options, logger) {

  var db = {}
  var modelCount = 0;
  var dbOptions = {
    host: options.sql.host || 'localhost',
    port: options.sql.port || 5432,
    database: options.sql.database || logger.error(new Error('Database not provided to SQLoader.')),
    username: options.sql.username || null,
    password: options.sql.password || null,
    dialect: options.sql.dialect || logger.error(new Error('Dialect not provided to SQLoader.')),
    storage: options.sql.storage || null,
    logging: (_.isBoolean(options.sql.logging)) ? options.sql.logging : false,
    persist: (_.isBoolean(options.sql.persist)) ? options.sql.persist : true
  }


  var sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password,  dbOptions)
  var modelDir = path.join(options.models, 'sql');

  logger.log('SQLoader: Loading SQL models from ' + modelDir)

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
    if(typeof model.associate === 'function') {
      model.associate(db)
    }
  })

  logger.log('SQLoader: Loaded ' + modelCount + ' Sql models.' )
  var SQL = _.extend({
    Seqelize: Sequelize,
    sequelize: sequelize
  }, db);

  injector.service('SQL', SQL);

  /**
   * Recursive authentication attempts to test connection to SQL server.
   * Sequelize is lazy and doesnt attempt to connect until a query is run.
   */
  var trySQLauth = function(){
    sequelize.authenticate()
      .then(function(){
        logger.log('DataHandlers: SQL connection successful.');

        sequelize.sync({force: !dbOptions.persist})
          .then(function(){
            emitter.emit('ready')
          })
          .catch(function(err){
            console.log('SQLoader: Error syncing database,',
              'this usually indicates a problem with your model definitions.')
            console.log(err)
          });
      })
      .catch(function(err){
        logger.error(err);
        setTimeout(function(){
          trySQLauth()
        }, 200)
      })
  };

  trySQLauth();

  return emitter
};

