# Pomegranate

### An unassuming framework for quickly building web applications.

#### Pomegranate is an Express driven, MVC framework that relies on Inversion of Control to manage Dependencies.

[![NPM Version][npm-image]][npm-url]
[![Linux][travis-image]][travis-url]

# Features

* Transparent model, controller and route loading, just drop your files into the correct directory (or configure it to use your own).
* Inversion of control makes it simple to gain access to your controllers, models, and custom dependencies.
* Out of the box support for PostgreSQL, MySQL, MsSQL and MariaDB with sequelize as the ORM. CouchDb support through Nano. Redis via, well Redis. Dont like any of those? Install and register your own and they will be available to you in your controllers and routes... Magic!
* Named controllers are available in any route, and can even use your own outside dependencies.
* Sane default middlewares, with the ability to easily add your own.
* Event based logging, so you choose what goes where.

### Install

```shell
npm install --save pomegranate
```

# Basic Usage

## Routes

First we need a route file, the default directory is `./routes/`, but you can configure that to whatever you want to fit your project structure.
Currently the only dependency that is required is `Router`, this gives you an instance of express.Router to attach your routes to.

In this file any function arguments matching a registered dependency will be available to you in the body of the function.

This includes any models you defined in `./models/sql/` or `./models/couch/` available in your function as `SQL.<modelname>` and `Couch.<modelname>` respectivly. Controller objects are available by adding the controllers filename to the function arguments, manually added
dependencies are available in the same fashion.

`./routes/frontPage.js`

```javascript
module.exports = function(Logger, Router, Thing, Thing2, Thing3){
  Router.get('/', function(req, res, next){
    Thing3.init('bob')
    res.render('Base', {a: Thing, b: Thing2('factory'), c: Thing3});
  })

  // Return the path this file lives on, as well as the Router.
  return {path: '/', router: Router}
};

```

## Views

The default view directory is `./views/`,  here is a simple base view. The system default is hbs, you can also use jade, and in the future
any templating you want.

`./views/Base.hbs`

```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>Pomegranate Demo</title>
</head>
<body>
    <h1>Welcome to Pomegranate</h1>
    <h3>IOC is  This is a simple service.</h3>
    <h3>This is a factory, ""</h3>
    <h3>It also does instances, if you need a newed object every time it is injected, for instance(get it?)</h3>
    <h3>This instance object is named </h3>
</body>
</html>
```

## Configure and Run

Your main file is responsible for creating and configuring the Pomegranate instance. Here you can specify all of your configuration options,
add middlewares, as well as add dependencies. Your Models, Controllers and Routes will automatically be loaded up, and the server will be started.

You can bind a few event handlers, mostly related to logging, to your Pomegranate instance. Dependancies are added via `Pomegranate#addDependency()` and can either take arguments for a single dependency or an array of objects describing your dependencies, it returns itself so further calls can be chained.

`./index.js`

```javascript
var pom = require('pomegranate')
var options = {
  address: '0.0.0.0',
  port: 8080
};

// Setup some custom dependencies.
var service = {ioc: 'is pretty cool'}

var factory = function(){
  return function(s){
    return {factory: 'it is a ' + s}
  }
}

var instance = function(){
  this.init = function(name) {
    this.name = name
  }
}

// Configure and run the server.
pom
.init(options)
.addDependency('Thing', service)
.addDependency([
    {name: 'Thing2', item: factory},
    {name: 'Thing3', item: instance, instance: true}
])
.start(function(err){
	if(err)
	  console.log(err)
})
.on('log', console.log)
.on('log-request', console.log)
.on('error', function(err){
    console.log(err.stack);
})
```

# Advanced Usage

\<coming soon\> We'll show how to write SQL and CouchDB models, and controllers that use both at the same time.

# Roadmap

* Expose a bit more of the underlying API's eg. It would be useful to get the Magnum DI instance Pomegranate is using, to use elsewhere in
an application.
* Fully configurable middleware stack. Enable, disable and order default middleware.
* Expose more templating customization.


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
| templating | <code>string</code> | <code>&quot;hbs&quot;</code> | Installed with Pomegranate [hbs, jade] |
| staticFiles | <code>string</code> | <code>&quot;./public&quot;</code> | Static files directory. Default is relative to the requiring file. |
| views | <code>string</code> | <code>&quot;./views&quot;</code> | View files directory. Default is relative to the requiring file. |
| routes | <code>string</code> | <code>&quot;./routes&quot;</code> | Route files directory. Default is relative to the requiring file. |
| models | <code>string</code> | <code>&quot;./models&quot;</code> | Model files directory. Default is relative to the requiring file. |
| controllers | <code>string</code> | <code>&quot;./controllers&quot;</code> | Controller files directory. Default is relative to the requiring file. |
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



[npm-image]: https://img.shields.io/npm/v/pomegranate.svg
[npm-url]: https://www.npmjs.com/package/pomegranate
[travis-image]: https://img.shields.io/travis/PaperElectron/Pomegranate/master.svg
[travis-url]: https://travis-ci.org/PaperElectron/Pomegranate