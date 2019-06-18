'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')


exports.Plugin = CreatePlugin({
  configuration: {
    name: 'D',
    type: 'anything',
    injectableParam: 'D',
    depends: []
  },
  hooks: {
    load: (PluginLogger, PluginVariables) => {
      return {name: 'D'}
    }
  }
})