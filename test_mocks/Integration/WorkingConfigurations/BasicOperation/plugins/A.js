'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')
const {createServer} = require('http')

exports.Plugin = CreatePlugin({
  variables: {a: 1, b: 2, c: 3},
  directories: [
    {prop: 'stuff', path: 'stuff'},
    {prop: 'other', path: 'other/stuff'}
  ],

  configuration: {
    name: 'A',
    injectableParam: 'A',
    type: 'anything',
    depends: ['Z']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore) => {
      PluginStore.name = 'A'
      PluginStore.server = createServer((req, res) => {
        res.write('Hello World')
        res.end()
      })
      strictEqual(Z.name, 'Z')
      ok(PluginVariables)
      // throw new Error('Wubba lubba')
      return {name: 'A'}
    },
    start: (PluginLogger, A, PluginStore, PluginLateError) => {
      strictEqual(PluginStore.name, 'A')
      strictEqual(A.name, 'A')
      // throw new Error('Wubba lubba dubb dub')
      setTimeout(() => {
        PluginLateError(new Error('Boop'))
      }, 5000)
      PluginLogger.log('A is starting')
      PluginStore.server.listen(8080)
    },
    stop: (PluginLogger, PluginStore) => {
      console.log('Stopping A')
      return new Promise((resolve) => {
        PluginStore.server.close((a, b) => {
          resolve(true)
        })
      })

    }
  }
})
