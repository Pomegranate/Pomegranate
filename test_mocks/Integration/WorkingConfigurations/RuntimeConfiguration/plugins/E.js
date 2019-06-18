'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')


exports.Plugin = CreatePlugin({
  configuration: {
    name: 'E',
    type: 'anything',
    injectableParam: 'E',
    depends: []
  },
  hooks: {
    load: (PluginLogger, PluginVariables) => {
      return {name: 'E'}
    }
  }
})