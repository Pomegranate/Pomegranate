<img align="left" style="padding:10px" src="./Pomegranate_icon.png" >
# Pomegranate 3.0.0-0 Beta

#### A wildly flexible application framework.

***
[![NPM Version][npm-image]][npm-url]
[![Linux][travis-image]][travis-url]
***

# Whats it do?

Pomegranate is a whitebox, Inversion of Control based application framework. It ingests simple plugins, orders them and runs the hooks they expose. With it you can build simple applications in just a few lines of code, or highly complex systems designed to scale.

Pomegranate automatically loads plugins prefixed with `pomegranate` found in your package.json, as well as your own plugins from whatever directory you choose. 

## Simple plugins are the building blocks to complex applications.

Pomegranate plugins are simple structures that make it easy to separate concerns and write unit tests. You can export one plugin from a 
module, and provide a very specific functionality, or you can export an array of them and build and entire application. 

### A very basic plugin example.

#### options
You can [optionally] define an options object for plugins, these values will be used as defaults in the absence
of a config file value that overrides them. Pomegranate also has a CLI app that loads all of your current plugins,
extracts their configs and writes them into a file for you. So you'll never have to worry about missing a configurable option.
 
```javascript
// file ./plugins/myFirstPlugin.js 
exports.options = {
	workDir: './files', //workDir is special, Pomegranate automatically builds an absolute path from it.
	city: 'Atlanta',
	state: 'Georgia'
}
```
#### metadata

Pomegranate requires plugins to tell it a little about themselves, so it knows just what to do when its their turn to run. 

```javascript
exports.metadata = {
	name: 'MyPlugin', // Used internally and for logging.
	layer: 'core', // The layer to load in. Anything loaded before is available to everything loaded after.
	type: 'service', // The type of 'thing' you are going to add.
	param: 'MyPlugin' // What should that 'thing' be called in the injector.
}
```
#### plugin

Here is where your code gets its time to shine. Pomegranate calls three plugin hooks at various phases of the 
application life cycle. Plugins are run in layer order, with all of the `load` hooks in a layer being run to
completion before the next layer above, and so on and so forth. Pomegranate defines 7 layers, but dont worry, 
if that isn't enough, or you need an extra layer or 10, you can do that too.

The `this` value of each hook is set to an object that contains properties and methods specifically 
tailored to your plugin. So you can do things like `this.Logger.log()` and have a nice formatted output prefixed with
your plugin name. 

The load hook is the most complex and bears a bit more discussion, specifically its two parameters
`inject` and `loaded`. 

The first, `inject` is a reference to the [Magnum-DI](https://github.com/PaperElectron/Magnum-DI#module_injector.inject) inject 
function, which accepts a function as a parameter, and provides arguments based on the parameter names provided to that function.
It is what gives you access to all of the other dependencies loaded into the framework by other plugins, provided they were
loaded in a layer before the one your plugin is loading in.

The second, `loaded` is an error first callback, its second parameter accepts an Object, Array or Function, based on the metadata 
value `type` you provided. This value is what will be added to the injector as `metadata.param` for other plugins to use.


```javascript
 exports.plugin = {
 	load: function(inject, loaded){
 	   	var self = this; // Feel free to use es6 and compile.
 		this.Logger.log('My first plugin has these options ' + this.options);
 		
 		// loaded is a callback, so take your sweet time calling it, Pomegranate will wait (for a bit anyway).
 		setTimeout(function(){
 		    var myDependency = {random: function(mult){return Math.random * (mult || 1)}};
 			loaded(null, myDependency)
 		}, 1000)
 	},
 	start: function(done){
 		// If you encounter an error in any of the hooks, just pass it to the callback
 		// and Pomegranate will bail as gracefully as it can.
 		done(null)
 	}
 	load: function(done){
 		done(null)
 	}
 }


```


[doc-url]: http://pomegranate.paperelectron.com
[npm-image]: https://img.shields.io/npm/v/pomegranate.svg
[npm-url]: https://www.npmjs.com/package/pomegranate
[travis-image]: https://img.shields.io/travis/PaperElectron/Pomegranate/master.svg
[travis-url]: https://travis-ci.org/PaperElectron/Pomegranate