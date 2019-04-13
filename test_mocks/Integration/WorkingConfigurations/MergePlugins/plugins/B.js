'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
  configuration: {
    name: 'B',
    injectableParam: 'Merger',
    type: 'merge',
    depends: ['C']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {
      strictEqual(Merger.C, 'C')
      return {B: 'B'}
    },
    start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
      strictEqual(Merger.B, 'B')
    }
  }
})