"use strict";
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

// exports.variables = {a: 1};
// exports.directories = [];
// exports.configuration = {
//   name: 'Y',
//   injectableParam: 'Y',
//   type: 'anything'
// };
// exports.hooks = {
//   load: async (Logger, Variables, PluginTimer) => {
//     ok(Variables)
//     return {name: 'Y'}
//   }
// }
// exports.commands = {};

exports.Plugin = CreatePlugin('anything')
  .variables({a: 1})
  .configuration({
    name: 'Y',
    injectableParam: 'Y',
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return {name: 'Y'}
    }
  })