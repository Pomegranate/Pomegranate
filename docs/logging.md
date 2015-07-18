---
layout: doc
title: Logging
---

### Logging shouldn't be hard.

#### Pomegranate gets out of your way.

<a name="Logger"></a>
## Logger ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends:** <code>EventEmitter</code>  
**Emits**: <code>[log](#Logger+event_log)</code>, <code>[error](#Logger+event_error)</code>, <code>[log-request](#Logger+event_log-request)</code>  

* [Logger](#Logger) ⇐ <code>EventEmitter</code>
  * ["log" (message, data)](#Logger+event_log)
  * ["error" (error)](#Logger+event_error)
  * ["log-request" (message, data)](#Logger+event_log-request)

<a name="Logger+event_log"></a>
### "log" (message, data)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 

<a name="Logger+event_error"></a>
### "error" (error)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| error | <code>object</code> | 

<a name="Logger+event_log-request"></a>
### "log-request" (message, data)
**Kind**: event emitted by <code>[Logger](#Logger)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| data | <code>object</code> | 

