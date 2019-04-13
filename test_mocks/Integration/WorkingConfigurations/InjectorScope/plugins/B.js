'use strict'
const {CreatePlugin} = require('@pomegranate/plugin-tools')
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

exports.Plugin = CreatePlugin({
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