'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')


exports.Plugin = CreatePlugin({
  configuration: {
    name: 'C',
    type: 'anything',
    injectableParam: 'C',
    depends: []
  },
  hooks: {
    load: (PluginLogger, PluginVariables) => {
      return {name: 'C'}
    }
  }
})