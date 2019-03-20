'use strict';
const {InjectablePlugin, ApplicationPlugin} = require('../../../../../Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin({
  configuration: {
    name: 'B',
    injectableParam: 'Merger',
    type: 'merge',
    depends: ['C']
  },
  hooks: {
    load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {
      strictEqual(Merger.C, 'C')
      return {B: 'B'}
    },
    start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
      strictEqual(Merger.B, 'B')
    }
  }
})

exports.variables = {};
// exports.directories = ['stuff', 'other/stuff'];
exports.directories = [];

exports.configuration = {
  name: 'B',
  injectableParam: 'Merger',
  type: 'merge',
  depends: ['C']
};
exports.hooks = {
  load: async (PluginLogger, PluginVariables, Z, PluginStore, Merger) => {
    strictEqual(Merger.C, 'C')
    return {B: 'B'}
  },
  start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
    strictEqual(Merger.B, 'B')
  }
}
exports.commands = {};