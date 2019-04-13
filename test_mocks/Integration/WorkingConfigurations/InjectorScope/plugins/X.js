'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
  variables: {a: 1},
  configuration: {
    name: 'X',
    injectableParam: 'X',
    type: 'anything'
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return {name: 'X'}
    }
  }
})

exports.variables = {a: 1};
exports.directories = [];
exports.configuration = {
  name: 'X',
  injectableParam: 'X',
  type: 'anything'
};
exports.hooks = {
  load: async (PluginLogger, PluginVariables, PluginTimer) => {
    ok(PluginVariables)
    return {name: 'X'}
  }
}
exports.commands = {};