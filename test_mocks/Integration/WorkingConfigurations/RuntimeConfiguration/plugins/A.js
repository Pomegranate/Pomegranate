'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')


exports.Plugin = CreatePlugin({
  configuration: {
    name: 'A',
    type: 'anything',
    injectableParam: 'A',
    depends: ['E']
  },
  hooks: {
    load: (PluginLogger, PluginVariables) => {
      return {name: 'A'}
    }
  }
})