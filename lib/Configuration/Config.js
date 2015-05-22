/**
 * @file Config
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var path = require('path');
var mainPath = path.dirname(require.main.filename);
var staticFiles = path.join(mainPath, 'public');
var defaultViews = path.join(mainPath, 'views');
var defaultRoutes = path.join(mainPath, 'routes');
var defaultModels = path.join(mainPath, 'models');


module.exports = function(opts){
  /**
   * Configuration options for Pomegranate.
   * @module Configuration
   * @property {number} [port = 8080] Server listening port.
   * @property {string} [address = 0.0.0.0] Server listening address.
   * @property {string} [templating = jade] Installed with Pomegranate [jade, handlebars]
   *
   * @property {string} [staticFiles = ./public] Static files directory. Default is relative to the requiring file.
   * @property {string} [views = ./views] View files directory. Default is relative to the requiring file.
   * @property {string} [routes = ./routes] Route files directory. Default is relative to the requiring file.
   * @property {string} [models = ./models] Model files directory. Default is relative to the requiring file.
   *
   * @property {object|boolean} [session = false] Session Configuration.
   * See [Express-session]{@link https://github.com/expressjs/session}
   * @property {string} [session.secret = process.exit()] No default, Pomegranate will exit if not set.
   * @property {string} [session.name = pomegranate.sid] Session cookie name.
   * @property {number} [session.ttl = 60 * 60 * 24 * 7] Expiration time for session data. In seconds.
   * @property {boolean} [session.resave = false] Save session on every request, even if unmodified.
   * @property {boolean} [session.rolling = false] Reset the session cookie expiration on every request.
   * @property {boolean} [session.saveUninitialized = false] Save new but unmodified session data.
   *
   * @property {object|boolean} [redis = false] Redis connection details.
   * See [Node Redis]{@link https://github.com/mranney/node_redis}
   * @property {string} [redis.host = localhost] Redis server address.
   * @property {number} [redis.port = 6379] Redis server port.
   * @property {string} [redis.password = null] Redis auth password.
   *
   * @property {object|boolean} [sql = false] SQL connection details.
   * See [Sequelize]{@link https://github.com/sequelize/sequelize}
   * @property {string} [sql.database = no default] SQL server address.
   * @property {number} [sql.port = no default] Sql Server Port.
   * @property {string} [sql.dialect = sqlite] SQL server dialect 'mysql','mariadb','sqlite','postgres','mssql'
   * @property {boolean} [sql.persist = true] Destroys all model databases and recreates on startup.
   *
   * @property {object|boolean} [couch = false] CouchDb connection details.
   * See [nano]{@link https://github.com/dscape/nano}
   * @property {string} [couch.url = no default] CouchDB connection url.
   * @property {string} [couch.prefix = pomegranate] Used to prefix database names, to support multitenancy.
   * @property {boolean} [couch.persist = true] Destroys all model databases and recreates on startup.
   */
  var validConfig = {
    port: opts.port || 8080,
    address: opts.address || '0.0.0.0',
    templating: opts.templating || 'jade',
    views: opts.views || defaultViews,
    staticFiles: opts.staticFiles || staticFiles,
    routes: opts.routes || defaultRoutes,
    models: opts.models || defaultModels,
    session: opts.session || false,
    redis: opts.redis || false,
    sql: opts.sql || false,
    couch: opts.couch || false
  }
  return validConfig
};
