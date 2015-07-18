---
layout: doc
title: Pomegranate
---

### This is where the magic happens.


<a name="Pomegranate"></a>
## Pomegranate ⇐ <code>Logger</code>
**Kind**: global class  
**Extends:** <code>Logger</code>  

* [Pomegranate](#Pomegranate) ⇐ <code>Logger</code>
  * [.init(options)](#Pomegranate+init) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.start(callback)](#Pomegranate+start) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.addMiddleware()](#Pomegranate+addMiddleware) ⇒ <code>[Pomegranate](#Pomegranate)</code>
  * [.addDependency()](#Pomegranate+addDependency) ⇒ <code>[Pomegranate](#Pomegranate)</code>

<a name="Pomegranate+init"></a>
### pomegranate.init(options) ⇒ <code>[Pomegranate](#Pomegranate)</code>
Sets up the Pomegranate framework.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - This instance.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Configuration</code> | The main config object for Pomegranate. pomegranate.init(options) |

<a name="Pomegranate+start"></a>
### pomegranate.start(callback) ⇒ <code>[Pomegranate](#Pomegranate)</code>
Starts the Pomegranate server instance.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  

| Param |
| --- |
| callback | 

<a name="Pomegranate+addMiddleware"></a>
### pomegranate.addMiddleware() ⇒ <code>[Pomegranate](#Pomegranate)</code>
Adds a middleware function, or an array of middleware functions to the global middleware stack.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  
<a name="Pomegranate+addDependency"></a>
### pomegranate.addDependency() ⇒ <code>[Pomegranate](#Pomegranate)</code>
Registers a dependency to be made available to the injector.

**Kind**: instance method of <code>[Pomegranate](#Pomegranate)</code>  
**Returns**: <code>[Pomegranate](#Pomegranate)</code> - this instance  
