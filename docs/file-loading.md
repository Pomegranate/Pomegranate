---
layout: doc
title: File Loading
---

### Directory structure doesn't have to be a drag.

#### We've got you covered.

Pomegranate looks for your applications files in a few places by default. As you would expect they are named
semantically. You can also override these defaults in the config object passed to `Pomegranate#init`.

On application start Pomegranate will recursively scan these directories and load the files inside.

To accommodate the dependency system, models will be loaded first, followed by controllers and finally routes.

A fairly straightforward application structure is shown below.

```
MyApplication
  |
  +-- node_modules/
  |
  +-- controllers/
  |   -- UserController.js
  |
  +-- models/
  |   +-- SQL/
  |   |   -- User.js
  |   +-- Couch/
  |       -- Images.js
  |
  +-- routes/
  |   -- index.js
  |   +-- user
  |       -- index.js
  |       -- list.js
  |
  +-- views/
  |   -- base.hbs
  |   +-- partials/
  |
  +-- index.js
```
Also See:

* [Configuration](/docs/configuration)
* [Dependency injection](/docs/dependency-management)
* [Route files](/docs/route-files)
* [Routing](/docs/routing)