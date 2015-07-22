---
layout: doc
title: Routing
---

### Pomegranate builds routes from your file structure.

The default route directory in Pomegranate is `./routes`, any files inside this directory will be mounted
in your application at a path corresponding to the file/path name.


#### Mount Paths

* Any file named `index.js`, `base.js`, `main.js` or `root.js` in a directory will be mounted as the directory name.
* Any file not named as above will be mounted as the filename with its directory as the preceding part of the path.


### Site root

This route will be accessed at `example.com/`
For very simple sites you can follow expressjs conventions here and add multiple Paths
to this file. But best practice is to define every separate path in your application as a
route file. Pomegranate makes no attempt (Yet) to check for route name collisions.

*As of `v1.0.0` all files in the base directory will be mounted at `/`*

```javascript

// "./routes/[index/main/root/base].js"

module.exports = function(Router){
  Router.get('/', function(req, res, next){

    res.json({path: '/'})
  })

  return Router
};

```

### Files in sub-directories.

Route files in base directories will be mounted as the directory name + filename. index files will be mounted
as the directory name.

```javascript

// "./routes/user/[index/main/root/base].js"

module.exports = function(Router){
  Router.get('/', function(req, res, next){

    res.json({path: '/user'})
  })
  Router.post('/', function(req, res, next){
    res.json({path: '/user', method: 'post'});
  })

  return Router
};
```

```javascript
// "./routes/user/info.js"

module.exports = function(Router){
  Router.get('/', function(req, res, next){

    res.json({path: '/user/info'})
  })

  return Router
};

```

Also See:

* [Route files](/docs/route-files)
* [File loading](/docs/file-loading)