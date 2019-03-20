'use strict';
const {InjectablePlugin, ApplicationPlugin} = require('../../../../../Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin({
  variables: {a: 1, b: 2},
  configuration: {
    name: 'Z',
    injectableParam: 'Z',
    type: 'anything'
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      PluginLogger.log(PluginVariables)
      ok(PluginVariables)
      return {name: 'Z'}
    }
  }
})

exports.variables = {a: 1, b: 2};
exports.directories = [];
exports.configuration = {
  name: 'Z',
  injectableParam: 'Z',
  type: 'anything'
};
exports.hooks = {
  load: async (PluginLogger, PluginVariables, PluginTimer) => {
    PluginLogger.log(PluginVariables)
    ok(PluginVariables)
    return {name: 'Z'}
  }
}
exports.commands = {};