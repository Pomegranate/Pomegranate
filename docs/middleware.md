---
layout: doc
title: Middleware
---

### A sane default with the ability to add or remove at will.

#### Pomegranate tries to take the sensible path.

Pomegranate mounts an array of middleware, followed by any user provided middleware,
finally followed by error handling middleware.

First Middleware

* Compression
* ResponseTime
* Favicon
* Static
* Session
* Logger
* BodyParser

User provided

* user middleware
* user middleware
* user middleware

Error handlers

* 404 handler
* 5xx handler


## Adding Middleware

Pomegranate exposes `Pomegranate#addMiddleware` which accepts a single function, or an array of functions.
These will be mounted in your app after the default middleware.

```javascript
var pom = require('pomegranate');
var options = {...};

pom
  .init('options')
  .addMiddleware(function(req, res, next){})
  .addMiddleware([
    function(req, res, next){console.log('addMiddleware'); next()},
    function(req, res, next){console.log('also accepts'); next()},
    function(req, res, next){console.log('an array'); next()}
  ])
  .start()
```

## Overriding defaults

### Need more control?

### Don't like Pomegranates default middleware stack? No Problem.

Pomegranate exposes two additional methods, which you can use to override the default middleware stack.

`Pomegranate#getDefaultMiddleware` will return an object with the default middleware functions, as configured
by the options object passed in to `Pomegranate#init`.

`Pomegranate#setDefaultMiddleware` will override the default array of middlware,
with the array of middleware functions passed.

```javascript
var pom = require('pomegranate');
var options = {...};

pom.init('options');

// Returns the initialized default middlewares.
var middlewares = pom.getDefaultMiddleware()

// Overrides the default array of middlewares.
pom.setDefaultMiddleware([middlewares.Session, middlewares.Logger]);

pom.start()

```