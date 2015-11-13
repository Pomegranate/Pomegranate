/**
 * @file Config
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var path = require('path');

module.exports = function(opts) {

  var mainPath;

  /**
   *  Get a reliable route to our base application directory.
   */
  if(opts.basePath){
    mainPath = opts.basePath
  } else {
    mainPath = path.dirname(require.main.filename);
  }

  var staticFiles = path.join(mainPath, 'public');
  var defaultViews = path.join(mainPath, 'views');
  var defaultPartials = path.join(defaultViews, 'partials');
  var defaultRoutes = path.join(mainPath, 'routes');
  var defaultModels = path.join(mainPath, 'models');
  var defaultControllers = path.join(mainPath, 'controllers');
  var defaultDependencies = path.join(mainPath, 'dependencies');
  /**
   * Controls server operation.
   * @module ServerOptions
   * @property {number} [port = 8080] Server listening port.
   * @property {string} [address = 0.0.0.0] Server listening address.
   * @property {string} [templating = hbs] Installed with Pomegranate [hbs, jade]
   * @property {string} [renderErrors = false] If true renders ./views/errors/404 ./views/errors/500 on error, else returns json.
   */

  /**
   * Controls Pomegranate file locations.
   * @module PathOptions
   * @property {string} [basePath = ./] This should generally be set to __dirname.
   * @property {string} [staticFiles = ./public] Static files directory. Default is relative to the requiring file.
   * @property {string} [views = ./views] View files directory. Default is relative to the requiring file.
   * @property {string} [partials = ./views/partials] Directory containing handlebars partials. Only for templating = hbs
   * @property {string} [routes = ./routes] Route files directory. Default is relative to the requiring file.
   * @property {string} [models = ./models] Model files directory. Default is relative to the requiring file.
   * @property {string} [controllers = ./controllers] Controller files directory. Default is relative to the requiring file.
   * @property {string} [dependencies = ./dependencies] Dependency files directory. Default is relative to the requiring file.
   */

  /**
   * Controls Server sessions and session storage.
   * @module SessionOptions
   * @property {object|boolean} [session = false] Session Configuration.
   * See [Express-session]{@link https://github.com/expressjs/session}
   * @property {string} [session.secret = process.exit()] No default, Pomegranate will exit if not set.
   * @property {string} [session.domain = false] No default, Domain to store cookie on.
   * @property {string} [session.name = pomegranate.sid] Session cookie name.
   * @property {number} [session.ttl = 60 * 60 * 24 * 7] Expiration time for session data. In seconds.
   * @property {boolean} [session.resave = false] Save session on every request, even if unmodified.
   * @property {boolean} [session.rolling = false] Reset the session cookie expiration on every request.
   * @property {boolean} [session.saveUninitialized = false] Save new but unmodified session data.
   */

  /**
   * Controls Redis connection settings.
   * @module RedisOptions
   * @property {object|boolean} [redis = false] Redis connection details.
   * See [Node Redis]{@link https://github.com/mranney/node_redis}
   * @property {string} [redis.host = localhost] Redis server address.
   * @property {number} [redis.port = 6379] Redis server port.
   * @property {string} [redis.password = null] Redis auth password.
   */

  /**
   * Controls SQL connection settings [Postgres, MySQL, MsSQL, MariaDB].
   * @module SQLOptions
   * @property {object|boolean} [sql = false] SQL connection details.
   * See [Sequelize]{@link https://github.com/sequelize/sequelize}
   * @property {string} [sql.database = no default] SQL server database.
   * @property {string} [sql.username = no default] SQL User.
   * @property {string} [sql.password = no default] SQL User password.
   * @property {string} [sql.host = localhost] SQL server address.
   * @property {number} [sql.port = no default] Sql Server Port.
   * @property {string} [sql.dialect = sqlite] SQL server dialect 'mysql','mariadb','sqlite','postgres','mssql'
   * @property {string} [sql.storage = no default] SQLITE only, path to db file.
   * @property {boolean} [sql.logging = false] LOG SQL queries
   * @property {boolean} [sql.persist = true] Destroys all model databases and recreates on startup.
   * @property {boolean} [sql.typeValidation = false] Run validators on insert and update for Primary keys.
   */

  /**
   * Controls CouchDB connection settings.
   * @module CouchOptions
   * @property {object|boolean} [couch = false] CouchDb connection details.
   * See [nano]{@link https://github.com/dscape/nano}
   * @property {string} [couch.url = no default] CouchDB connection url.
   * @property {string} [couch.prefix = pomegranate] Used to prefix database names, to support multitenancy.
   * @property {boolean} [couch.persist = true] Destroys all model databases and recreates on startup.
   */

  return {
    port: opts.port || 8080,
    address: opts.address || '0.0.0.0',
    templating: opts.templating || 'hbs',
    renderErrors: opts.renderErrors || false,
    views: opts.views || defaultViews,
    partials: opts.partials || defaultPartials,
    staticFiles: opts.staticFiles || staticFiles,
    routes: opts.routes || defaultRoutes,
    models: opts.models || defaultModels,
    controllers: opts.controllers || defaultControllers,
    dependencies: opts.dependencies || defaultDependencies,
    session: opts.session || false,
    redis: opts.redis || false,
    sql: opts.sql || false,
    couch: opts.couch || false
  };
};
