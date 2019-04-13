'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
  variables: {a: 1, b: 2},
  configuration: {
    name: 'Z',
    injectableParam: 'Z',
    type: 'anything',
    depends: ['Merger']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, PluginTimer, Merger) => {
      strictEqual(Merger.C, 'C')
      strictEqual(Merger.B, 'B')
      strictEqual(Merger.A, 'A')

      ok(PluginVariables)
      return {name: 'Z'}
    }
  }
})