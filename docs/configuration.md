---
layout: doc
title: Configuration
---

### Pomegranate takes 1 object for its configuration.

#### From a file? Environment vars? How you provide it is up to you.

```javascript
var options = {
    port: 8080,
    address: "0.0.0.0",
    session: false
}
```

<a name="module_ServerOptions"></a>
## ServerOptions
Controls server operation.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>number</code> | <code>8080</code> | Server listening port. |
| address | <code>string</code> | <code>&quot;0.0.0.0&quot;</code> | Server listening address. |
| templating | <code>string</code> | <code>&quot;hbs&quot;</code> | Installed with Pomegranate [hbs, jade] |
| renderErrors | <code>string</code> | <code>false</code> | If true renders ./views/errors/404 ./views/errors/500 on error, else returns json. |



<a name="module_PathOptions"></a>
## PathOptions
Controls Pomegranate file locations.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| basePath | <code>string</code> | <code>&quot;./&quot;</code> | This should generally be set to __dirname. |
| staticFiles | <code>string</code> | <code>&quot;./public&quot;</code> | Static files directory. Default is relative to the requiring file. |
| views | <code>string</code> | <code>&quot;./views&quot;</code> | View files directory. Default is relative to the requiring file. |
| partials | <code>string</code> | <code>&quot;./views/partials&quot;</code> | Directory containing handlebars partials. Only for templating = hbs |
| routes | <code>string</code> | <code>&quot;./routes&quot;</code> | Route files directory. Default is relative to the requiring file. |
| models | <code>string</code> | <code>&quot;./models&quot;</code> | Model files directory. Default is relative to the requiring file. |
| controllers | <code>string</code> | <code>&quot;./controllers&quot;</code> | Controller files directory. Default is relative to the requiring file. |
| dependencies | <code>string</code> | <code>&quot;./dependencies&quot;</code> | Dependency files directory. Default is relative to the requiring file. |



<a name="module_SessionOptions"></a>
## SessionOptions
Controls Server sessions and session storage.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| session | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | Session Configuration. See [Express-session](https://github.com/expressjs/session) |
| session.secret | <code>string</code> | <code>&quot;process.exit()&quot;</code> | No default, Pomegranate will exit if not set. |
| session.domain | <code>string</code> | <code>false</code> | No default, Domain to store cookie on. |
| session.name | <code>string</code> | <code>&quot;pomegranate.sid&quot;</code> | Session cookie name. |
| session.ttl | <code>number</code> | <code>60 * 60 * 24 * 7</code> | Expiration time for session data. In seconds. |
| session.resave | <code>boolean</code> | <code>false</code> | Save session on every request, even if unmodified. |
| session.rolling | <code>boolean</code> | <code>false</code> | Reset the session cookie expiration on every request. |
| session.saveUninitialized | <code>boolean</code> | <code>false</code> | Save new but unmodified session data. |



<a name="module_RedisOptions"></a>
## RedisOptions
Controls Redis connection settings.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| redis | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | Redis connection details. See [Node Redis](https://github.com/mranney/node_redis) |
| redis.host | <code>string</code> | <code>&quot;localhost&quot;</code> | Redis server address. |
| redis.port | <code>number</code> | <code>6379</code> | Redis server port. |
| redis.password | <code>string</code> | <code>null</code> | Redis auth password. |



<a name="module_SQLOptions"></a>
## SQLOptions
Controls SQL connection settings [Postgres, MySQL, MsSQL, MariaDB].

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | SQL connection details. See [Sequelize](https://github.com/sequelize/sequelize) |
| sql.database | <code>string</code> | <code>&quot;no default&quot;</code> | SQL server database. |
| sql.username | <code>string</code> | <code>&quot;no default&quot;</code> | SQL User. |
| sql.password | <code>string</code> | <code>&quot;no default&quot;</code> | SQL User password. |
| sql.host | <code>string</code> | <code>&quot;localhost&quot;</code> | SQL server address. |
| sql.port | <code>number</code> | <code>no default</code> | Sql Server Port. |
| sql.dialect | <code>string</code> | <code>&quot;sqlite&quot;</code> | SQL server dialect 'mysql','mariadb','sqlite','postgres','mssql' |
| sql.storage | <code>string</code> | <code>&quot;no default&quot;</code> | SQLITE only, path to db file. |
| sql.logging | <code>boolean</code> | <code>false</code> | LOG SQL queries |
| sql.persist | <code>boolean</code> | <code>true</code> | Destroys all model databases and recreates on startup. |



<a name="module_CouchOptions"></a>
## CouchOptions
Controls CouchDB connection settings.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| couch | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | CouchDb connection details. See [nano](https://github.com/dscape/nano) |
| couch.url | <code>string</code> | <code>&quot;no default&quot;</code> | CouchDB connection url. |
| couch.prefix | <code>string</code> | <code>&quot;pomegranate&quot;</code> | Used to prefix database names, to support multitenancy. |
| couch.persist | <code>boolean</code> | <code>true</code> | Destroys all model databases and recreates on startup. |

