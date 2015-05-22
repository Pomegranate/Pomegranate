# Pomegranate

### An unassuming framework for quickly building web applications.

### Install

```shell
npm install --save pomegranate
```

### Setup

```javascript
var pom = require('pomegranate')
var options = {
address: '0.0.0.0',
port: 8080
};

pom
.init(options)
.start()
.on('log', console.log)
.on('error', function(err){
    console.log(err.stack);
})
```

### Full Example

You can check out an example implementation using most of Pomegranate's features [right here.](https://github.com/PaperElectron/Pomegranate_Example)


# Features

* Recursive model and route loader.
* Easy to use dependency injection.
* SQL, Redis and CouchDB available in every route.
* Event based logging.

# API


<a name="Pomegranate"></a>
## Pomegranate ⇐ <code>[Logger](#Logger)</code>
**Kind**: global class  
**Extends:** <code>[Logger](#Logger)</code>  

* [Pomegranate](#Pomegranate) ⇐ <code>[Logger](#Logger)</code>
  * [.init(options)](#Pomegranate#init) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.start(callback)](#Pomegranate#start) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.addMiddleware()](#Pomegranate#addMiddleware) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.addDependency()](#Pomegranate#addDependency) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * ["log" (message, data)](#Logger#event_log)
  * ["error" (error)](#Logger#event_error)
  * ["log-request" (message, data)](#Logger#event_log-request)

<a name="Pomegranate#init"></a>
### pomegranate.init(options) ⇒ <code>[Pomegranate](#Pomegranate)</code>
Sets up the Pomegranate framework.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - This instance.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Configuration</code> | The main config object for Pomegranate. |

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
<a name="Pomegranate#start"></a>
### pomegranate.start(callback) ⇒ <code>[Pomegranate](#Pomegranate)</code>
Starts the Pomegranate server instance.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  

| Param |
| --- |
| callback | 

<a name="Pomegranate#addMiddleware"></a>
### pomegranate.addMiddleware() ⇒ <code>[Pomegranate](#Pomegranate)</code>
Adds a middleware function, or an array of middleware functions to the global middleware stack.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  
<a name="Pomegranate#addDependency"></a>
### pomegranate.addDependency() ⇒ <code>[Pomegranate](#Pomegranate)</code>
Registers a dependency to be made available to the injector.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  
<a name="Logger#event_log"></a>
### "log" (message, data)
**Kind**: event emitted by <code>[Pomegranate](#Pomegranate)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 

<a name="Logger#event_error"></a>
### "error" (error)
**Kind**: event emitted by <code>[Pomegranate](#Pomegranate)</code>  

| Param | Type |
| --- | --- |
| error | <code>object</code> | 

<a name="Logger#event_log-request"></a>
### "log-request" (message, data)
**Kind**: event emitted by <code>[Pomegranate](#Pomegranate)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 



<a name="module_Configuration"></a>
## Configuration
Configuration options for Pomegranate.

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>number</code> | <code>8080</code> | Server listening port. |
| address | <code>string</code> | <code>&quot;0.0.0.0&quot;</code> | Server listening address. |
| templating | <code>string</code> | <code>&quot;jade&quot;</code> | Installed with Pomegranate [jade, handlebars] |
| staticFiles | <code>string</code> | <code>&quot;./public&quot;</code> | Static files directory. Default is relative to the requiring file. |
| views | <code>string</code> | <code>&quot;./views&quot;</code> | View files directory. Default is relative to the requiring file. |
| routes | <code>string</code> | <code>&quot;./routes&quot;</code> | Route files directory. Default is relative to the requiring file. |
| models | <code>string</code> | <code>&quot;./models&quot;</code> | Model files directory. Default is relative to the requiring file. |
| session | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | Session Configuration. See [Express-session](https://github.com/expressjs/session) |
| session.secret | <code>string</code> | <code>&quot;process.exit()&quot;</code> | No default, Pomegranate will exit if not set. |
| session.name | <code>string</code> | <code>&quot;pomegranate.sid&quot;</code> | Session cookie name. |
| session.ttl | <code>number</code> | <code>60 * 60 * 24 * 7</code> | Expiration time for session data. In seconds. |
| session.resave | <code>boolean</code> | <code>false</code> | Save session on every request, even if unmodified. |
| session.rolling | <code>boolean</code> | <code>false</code> | Reset the session cookie expiration on every request. |
| session.saveUninitialized | <code>boolean</code> | <code>false</code> | Save new but unmodified session data. |
| redis | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | Redis connection details. See [Node Redis](https://github.com/mranney/node_redis) |
| redis.host | <code>string</code> | <code>&quot;localhost&quot;</code> | Redis server address. |
| redis.port | <code>number</code> | <code>6379</code> | Redis server port. |
| redis.password | <code>string</code> | <code>null</code> | Redis auth password. |
| sql | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | SQL connection details. See [Sequelize](https://github.com/sequelize/sequelize) |
| sql.database | <code>string</code> | <code>&quot;no default&quot;</code> | SQL server address. |
| sql.port | <code>number</code> | <code>no default</code> | Sql Server Port. |
| sql.dialect | <code>string</code> | <code>&quot;sqlite&quot;</code> | SQL server dialect 'mysql','mariadb','sqlite','postgres','mssql' |
| sql.persist | <code>boolean</code> | <code>true</code> | Destroys all model databases and recreates on startup. |
| couch | <code>object</code> &#124; <code>boolean</code> | <code>false</code> | CouchDb connection details. See [nano](https://github.com/dscape/nano) |
| couch.url | <code>string</code> | <code>&quot;no default&quot;</code> | CouchDB connection url. |
| couch.prefix | <code>string</code> | <code>&quot;pomegranate&quot;</code> | Used to prefix database names, to support multitenancy. |
| couch.persist | <code>boolean</code> | <code>true</code> | Destroys all model databases and recreates on startup. |



<a name="Logger"></a>
## Logger ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends:** <code>EventEmitter</code>  
**Emits**: <code>[log](#Logger#event_log)</code>, <code>[error](#Logger#event_error)</code>, <code>[log-request](#Logger#event_log-request)</code>  

* [Logger](#Logger) ⇐ <code>EventEmitter</code>
  * ["log" (message, data)](#Logger#event_log)
  * ["error" (error)](#Logger#event_error)
  * ["log-request" (message, data)](#Logger#event_log-request)

<a name="Logger#event_log"></a>
### "log" (message, data)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 

<a name="Logger#event_error"></a>
### "error" (error)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| error | <code>object</code> | 

<a name="Logger#event_log-request"></a>
### "log-request" (message, data)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 

