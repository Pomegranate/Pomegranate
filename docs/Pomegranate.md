<a name="module_Pomegranate"></a>
## Pomegranate
An unassuming framework for building apps.


* [Pomegranate](#module_Pomegranate)
  * [~init(options)](#module_Pomegranate..init) ⇒ <code>Pomegranate</code>
  * [~registerMiddleware(middleware)](#module_Pomegranate..registerMiddleware) ⇒ <code>Pomegranate</code>
  * [~registerDependency(name, item)](#module_Pomegranate..registerDependency) ⇒ <code>Pomegranate</code>
  * [~start(cb)](#module_Pomegranate..start) ⇒ <code>Pomegranate</code>

<a name="module_Pomegranate..init"></a>
### Pomegranate~init(options) ⇒ <code>Pomegranate</code>
Sets up the Pomegranate framework.

**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The main config object for Pomegranate. |
| options.port | <code>Number</code> | Listening port. default: 8080 |
| options.address | <code>String</code> | Listening address. default: 0.0.0.0 |
| options.session | <code>Object</code> | Session config. default: null |
| options.session.secret | <code>String</code> | Secret used to hash sessions. |
| options.session.ttl | <code>Number</code> | Seconds this key should exist. default: 604800 |
| options.redis | <code>Object</code> | Redis config. default: null |
| options.redis.host | <code>String</code> | Redis server hostname. |
| options.redis.port | <code>Number</code> | Redis server port. |
| options.redis.password | <code>String</code> | Redis server auth password. |
| options.redis.database | <code>Number</code> | Redis server database. default: 0 |
| options.sql | <code>Object</code> | SQL config. default: null |
| options.sql.database | <code>String</code> | SQL database name. |
| options.sql.username | <code>String</code> | SQL database user. |
| options.sql.password | <code>String</code> | SQL database password. |
| options.sql.dialect | <code>String</code> | SQL server type <sqlite, mysql, postgresql, mssql, mariadb> |
| options.sql.host | <code>String</code> | SQL server hostname. |
| options.sql.port | <code>Number</code> | SQL server port. |
| options.sql.logging | <code>Boolean</code> | Log SQL queries to console. |
| options.couch | <code>Object</code> | CouchDB config. default: null |
| options.couch.url | <code>String</code> | CouchDB server url. |

**Example**
  
```js
var options = {
 port: 8081,
 address: 0.0.0.0,
 session: {secret: 'asask...', ttl: 50000000 },
 redis: {host: 'localhost', port: 6379, password: null},
 sql: {
  database: "sqlite://data/",
  dialect: 'sqlite',
  storage: __dirname + '/data',
  logging: false
 },
 couch: {url: 'http://localhost:5984'}
}

pomegranate.init(options)
```
<a name="module_Pomegranate..registerMiddleware"></a>
### Pomegranate~registerMiddleware(middleware) ⇒ <code>Pomegranate</code>
Registers middleware functions with express.

**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  
**Returns**: <code>Pomegranate</code> - Returns the current Pomegranate instance.  

| Param | Type |
| --- | --- |
| middleware | <code>Array.&lt;function()&gt;</code> &#124; <code>function</code> | 

**Example**  
```js
// Accepts a single function.

pomegranate.registerMiddleware(function(req, res, next){
 //do something
 next()
}
```
**Example**  
```js
pomegranate.registerMiddleware([
 function(req, res, next){next()},
 function(req, res, next){next()},
 function(req, res, next){next()}
])
```
<a name="module_Pomegranate..registerDependency"></a>
### Pomegranate~registerDependency(name, item) ⇒ <code>Pomegranate</code>
Registers a dependency with the injection framework.

**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> &#124; <code>Array.&lt;Object&gt;</code> | The name to register with the Injector. |
| item | <code>Object</code> | The dependency that will be returned for {name} |

**Example**  
```js
//Accepts a name and an object to inject

pomegranate.registerDependency('MyDatabase', returnMyDatabase())
```
**Example**  
```js
//Accepts an array of objects representing the objects to register with the injector.

pomegranate.registerDependency([
 {name: 'MyDB', returnMyDB()},
 {name: 'StaticData', {a: 10, b: 20}}
])
```
<a name="module_Pomegranate..start"></a>
### Pomegranate~start(cb) ⇒ <code>Pomegranate</code>
Starts the Pomegranate server.

**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Function to be called on successful server start. |

