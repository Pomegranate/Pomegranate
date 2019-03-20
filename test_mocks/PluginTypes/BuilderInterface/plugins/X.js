'use strict';
const {InjectablePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin()
  .variables({a: 1})
  .configuration({
    name: 'X',
    injectableParam: 'X',
    type: 'anything'
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return {name: 'X'}
    }
  })