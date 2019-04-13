'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin('anything')
  .variables({a: 1})
  .configuration({
    name: 'X',
    injectableParam: 'X',
    injectableScope: 'global',
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer, HelloPomegranate) => {
      ok(PluginVariables)
      return {name: 'X'}
    }
  })