'use strict'
const {InjectablePlugin, ApplicationPlugin} = require('../../../../../Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'B',
  type: 'action',
  depends: ['Y']
};
exports.hooks = {
  load: (PluginLogger, PluginVariables, Y) => {
    strictEqual(Y.name, 'Y')
  }
}
exports.commands = {};

exports.Plugin = InjectablePlugin({
  configuration: {
    name: 'B',
    type: 'action',
    depends: ['Y']
  },
  hooks: {
    load: (PluginLogger, PluginVariables, Y) => {
      strictEqual(Y.name, 'Y')
    }
  }
})