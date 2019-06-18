'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')


exports.Plugin = CreatePlugin({
  configuration: {
    name: 'B',
    type: 'anything',
    injectableParam: 'B',
    depends: [],
    provides: ['A']
  },
  hooks: {
    load: (PluginLogger, PluginVariables) => {
      return {name: 'B'}
    }
  }
})