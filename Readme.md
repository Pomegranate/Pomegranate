# Pomegranate

### An unassuming framework for building web applications.

```shell
npm install --save pomegranate 
```

```javascript
var pom = require('pomegranate')
var options = {
	address: '0.0.0.0',
	port: 8080
};

pom
  .init(options)
  .start()
  .on('log', console.log)
  .on('error', function(err){
  	console.log(err.stack);
  })  
```