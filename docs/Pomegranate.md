<a name="module_Pomegranate"></a>
## Pomegranate
Pomegranate - An unassuming framework for building apps.


* [Pomegranate](#module_Pomegranate)
  * [~init(opts)](#module_Pomegranate..init) ⇒ <code>Pomegranate</code>
  * [~registerMiddleware(middleware)](#module_Pomegranate..registerMiddleware) ⇒ <code>Pomegranate</code>
  * [~registerDependency(name, name, name[].name, name[].item, item)](#module_Pomegranate..registerDependency) ⇒ <code>Pomegranate</code>
  * [~start - Starts the configured express server instance.(cb)](#module_Pomegranate..start - Starts the configured express server instance.) ⇒ <code>Pomegranate</code>
  * [~verifyConfig()](#module_Pomegranate..verifyConfig)

<a name="module_Pomegranate..init"></a>
### Pomegranate~init(opts) ⇒ <code>Pomegranate</code>
**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | options object. |

<a name="module_Pomegranate..registerMiddleware"></a>
### Pomegranate~registerMiddleware(middleware) ⇒ <code>Pomegranate</code>
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
### Pomegranate~registerDependency(name, name, name[].name, name[].item, item) ⇒ <code>Pomegranate</code>
**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name to register with the Injector. |
| name | <code>Array.&lt;Object&gt;</code> | an array of objects to register |
| name[].name | <code>string</code> | The name to register with the Injector. |
| name[].item | <code>Object</code> | The dependency that will be returned for name[].name |
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
<a name="module_Pomegranate..start - Starts the configured express server instance."></a>
### Pomegranate~start - Starts the configured express server instance.(cb) ⇒ <code>Pomegranate</code>
**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Function to be called on successful server start. |

<a name="module_Pomegranate..verifyConfig"></a>
### Pomegranate~verifyConfig()
Utility and validation.

**Kind**: inner method of <code>[Pomegranate](#module_Pomegranate)</code>  
