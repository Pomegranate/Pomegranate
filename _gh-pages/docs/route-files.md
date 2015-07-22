---
layout: doc
title: Route files
---

### Route file examples

Pomegranate follows express.js conventions in its handling of route files. Route definitions should
handle one path and one path only.

Pomegranate injects variables for use in your route files, by default you will get a new instance of
`Router`, which *must* be returned from this function. If you fail to return the Router instance
Pomegranate will throw an error and fail to mount the route.

Example: ./routes/index.js

```javascript

module.exports = function(Router){
  Router.get(function(req, res, next){
      res.json({path: '/'})
    })

  // Router must be returned here.
  return Router
};

```

### Multiple method declarations.

Pomegranate allows you to define multiple methods on a route very easily as shown below.

Example: ./routes/user/index.js

```javascript

module.exports = function(Router){
  Router.get('/', function(req, res, next){
      res.json({path: '/user'})
  })

  Router.post('/',function(req, res, next){

    res.json({path: '/user', body: req.body})
  })

  // Router must be returned here.
  return Router
};

```

Alternatively you can use the express Routers shortcut method for defining multiple methods.

```javascript
module.exports = function(Router){
  Router.route('/')
    .get(function(req, res){
      res.json({path: '/herp'})
    })
    .post(function(req, res){
      res.json({path: '/user', body: req.body})
    })

  // Router must be returned here.
  return Router
};
```

Also See:

* [Dependency injection](/docs/dependency-management)
* [Routing](/docs/routing)
* [File loading](/docs/file-loading)