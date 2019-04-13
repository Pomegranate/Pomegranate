'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
  configuration: {
    name: 'A',
    injectableParam: 'Merger',
    type: 'merge',
    depends: ['B']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {

      strictEqual(Merger.C, 'C')
      strictEqual(Merger.B, 'B')
      return {A: 'A'}
    },
    start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
      strictEqual(Merger.A, 'A')
    }
  }
})