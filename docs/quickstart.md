---
layout: doc
title: Quickstart
order: 0
---

### The very basics.

You are going to need a relativly recent version of NodeJS or IO.js, and a new Node project.
Start by creating a project directory and running npm init inside.

```bash
$ mkdir myNewSite && cd myNewSite && npm init
```

Then we can install Pomegranate.

```bash
$ npm install --save pomegranate
```

Finally we can create a couple of directories and files.

```bash
$ mkdir routes views
$ touch app.js routes/index.js views/base.hbs
```

Now that that is done we can add a route to `routes/index.js`, all of Pomegranates routers will take this
basic form. Remember that you must return the `Router` parameter that is automatically passed in as
an argument to this function.

File: `./routes/index.js``

```javascript
module.exports = function(Router){
  Router.get('/', function(req, res, next){
    res.render('base')
  }

  // Router Object must be returned.
  return Router
}
```

File: `./views/base.hbs`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Pomegranate Quick Start</title>
  </head>
  <body>
    <h1>Welcome to Pomegranate</h1>
  </body>
</html>
```

Now that we have created the basic files Pomegranate needs to run we can create our application.
There are a lot of options available to customize Pomegranate, but for now you can just specify the port.
See [Configuration](/docs/configuration) for all available config options.

File `./app.js`

```javascript
var pom = require('pomegranate')

var options = {
  port: 8080
}

pom
  .init(options)
  .start()
```

For the bare bones basic server, the above is all that you need. You can run it with `$ node app.js`.
and you should see "Welcome to Pomegranate" at `localhost:8080`.

### Slightly more advanced usage, adding logging.

Obviously the above code doesn't really do much other than demonstrate how to get the server running,
you probably noticed, for instance, that your server did not produce any log output, or have any dynamic content?

In this section well go over a few more advanced concepts. We can start by adding some log listeners to
our Pomegranate instance. Pomegranate listens for 3 logging events, `error`, `log` and `log-request`.
The error log does what you would expect, the `log` listener logs platform messages from Pomegranate itself,
and `log-request` logs incoming requests with metadata. [You can read more about logging here.](/docs/logging)

File: `./app.js`

```javascript
var pom = require('pomegranate')

var options = {
  port: 8080
}

pom
  .init(options)
  .start()
  .on('log', function(msg, obj) {
      console.log(msg)
  })
  .on('log-request', function(msg, obj){
      console.log(msg)
      console.log(obj)
  })
  .on('error', function(err) {
      console.log(err)
  });
```

Run your server with `node app.js` and you should now see all kinds of informative messages. Of course, you can
do whatever you like with this data, like put it into a database or a file.

### Dynamic content, our first controller.

Controllers are the heart of our Pomegranate applications, they link our Models together and provide
an easy way to get data into and out of a route. One thing to note, dependencies like controllers,
will be injected into your route file based on the arguments passed in.


So with that in mind lets create a new directory and controller file.

```bash
$ mkdir controllers
$ touch controllers/Dynamic.js
```

Our very simple controller is just a function that returns an object, in this case it has a variable to store
the number of requests, and a function to increment and return it. This should give us a quick and easy
way to count the number of requests to this endpoint.

File: `./controllers.Dynamic.js`

```javascript
module.exports = function(){
  var requestCount = 0
  return {
    countReq: function(){
      return requestCount += 1
    }
  }
}
```

Now we can update our `base.hbs` file with a template variable for the `requestCount` variable in
our controller.

File: `./views/base.hbs`

```handlebars
<!DOCTYPE html>
<html>
  <head>
    <title>Pomegranate Quick Start</title>
  </head>
  <body>
    <h1>Welcome to Pomegranate</h1>

    <p> Total Requests: {{ "{{count"}}}} </p>


  </body>
</html>
```

#### Now, for a bit of magic.

Now we will update our route file, so it can get a reference to the `Dynamic.js` controller we just created.
This Object will be passed in to any route file that has `Dynamic` as a parameter.

File: `./routes/index.js``

```javascript

// Note the additional parameter "Dynamic", this will be
// a reference to the Object your controller returned.

module.exports = function(Router, Dynamic){

  Router.get('/', function(req, res, next){
    res.render('Base', {count: Dynamic.countReq()});
  })

  return Router
};
```

If you run your server now with `node app.js` and make a few requests to `localhost:8080`, you should
see the "Total Requests" count increment up.

So there you have it, just a few lines of code in a few files and you are on your way to building a
simple, flexible, easy to maintain application.

If you like you can take a few minutes to check out some of the links below to gain a more in depth
understanding of how the parts of Pomegranate work together.

Also See:

* [Models](/docs/models)
* [Controllers](/docs/controller)
* [Dependency Injection](/docs/dependency-management)
* [Route files](/docs/route-files)
* [File loading](/docs/file-loading)