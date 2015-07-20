<img align="left" style="padding:10px" src="./Pomegranate_icon.png" >
### Pomegranate

#### Complex applications without complex structure.

Pomegranate is an Express driven, MVC framework that relies on Inversion of Control to manage Dependencies.

***

[![NPM Version][npm-image]][npm-url]
[![Linux][travis-image]][travis-url]

# Features

[![Awesome][deep-field]][doc-url]

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

## [Full Documentation](http://pomegranate.paperelectron.com)

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

  // Return the Router.
  return Router
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

[deep-field]: ./_gh-pages/public/img/deep_field.png
[doc-url]: http://pomegranate.paperelectron.com
[npm-image]: https://img.shields.io/npm/v/pomegranate.svg
[npm-url]: https://www.npmjs.com/package/pomegranate
[travis-image]: https://img.shields.io/travis/PaperElectron/Pomegranate/master.svg
[travis-url]: https://travis-ci.org/PaperElectron/Pomegranate