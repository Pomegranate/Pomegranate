'use strict';
const {InjectablePlugin, ApplicationPlugin} = require('../../../../../Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin({
  configuration: {
    name: 'A',
    injectableParam: 'Merger',
    type: 'merge',
    depends: ['B']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {

      strictEqual(Merger.C, 'C')
      strictEqual(Merger.B, 'B')
      return {A: 'A'}
    },
    start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
      strictEqual(Merger.A, 'A')
    }
  }
})
exports.variables = {};
// exports.directories = ['stuff', 'other/stuff'];
exports.directories = [];

exports.configuration = {
  name: 'A',
  injectableParam: 'Merger',
  type: 'merge',
  depends: ['B']
};
exports.hooks = {
  load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {

    strictEqual(Merger.C, 'C')
    strictEqual(Merger.B, 'B')
    return {A: 'A'}
  },
  start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
    strictEqual(Merger.A, 'A')
  }
}
exports.commands = {};