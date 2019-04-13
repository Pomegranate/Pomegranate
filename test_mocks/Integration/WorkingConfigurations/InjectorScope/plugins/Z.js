'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
  variables: {a: 1, b: 2},
  configuration: {
    name: 'Z',
    injectableParam: 'Z',
    type: 'anything'
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      PluginLogger.log(PluginVariables)
      ok(PluginVariables)
      return {name: 'Z'}
    }
  }
})
