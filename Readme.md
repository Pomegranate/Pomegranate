<img align="left" style="padding:10px" src="http://pomegranate.io/img/pomegranate_100.png" >

# Pomegranate 7 Beta

#### A wildly flexible application framework.

***
[![NPM Version][npm-image]][npm-url]
[![Linux][travis-image]][travis-url]
***

# Beta installation

```bash
yarn add pomegranate@beta
yarn add --dev pomegranate-cli

pom init myProject
pom application configure --environment (pom a c -e)
pom application build --clean (pom a b -c)
pom start
```

# Install and configure plugins

```bash
yarn add @restmatic/server

```

Edit `pomegranateSettings.js#pluginNamespaces` to make them visible to Pomegranate.

`pluginNamespaces: ['restmatic']`


```bash
pom a c -e #builds plugins configs and directory structure
pom plugin @restmatic/router generate my/path # generates a route file
pom a b -c
pom start
```


[doc-url]: http://pomegranate.paperelectron.com
[npm-image]: https://img.shields.io/npm/v/pomegranate.svg
[npm-url]: https://www.npmjs.com/package/pomegranate
[travis-image]: https://travis-ci.org/Pomegranate/Pomegranate.svg?branch=master
[travis-url]: https://travis-ci.org/Pomegranate/Pomegranate
