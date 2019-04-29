'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')
const {createServer} = require('http')

exports.Plugin = CreatePlugin({
  variables: {a: 1, b: 2, c: 3},
  directories: [
  ],

  configuration: {
    name: 'ApplicationMember',
    injectableParam: 'ApplicationMember',
    type: 'anything',
    depends: [],
    applicationMember: ['ApplicationPlugin']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore) => {
      return {name: 'A'}
    },
    start: (PluginLogger, A, PluginStore, PluginLateError) => {
      PluginLogger.log('A is starting')
    },
    stop: (PluginLogger, PluginStore) => {
    }
  }
})
