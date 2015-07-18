#!/usr/bin/env bash

./node_modules/.bin/jsdoc2md -t docs/configuration.hbs lib/Configuration/Config.js > _gh-pages/docs/configuration.md
./node_modules/.bin/jsdoc2md -t docs/logging.hbs lib/Utilities/LogEmitter.js > _gh-pages/docs/logging.md
./node_modules/.bin/jsdoc2md -t docs/pomegranate.hbs lib/Pomegranate.js > _gh-pages/docs/pomegranate.md