"use strict";
const {strictEqual, equal, ok} = require('assert')

exports.variables = {a: 1};
exports.directories = [];
exports.configuration = {
  name: 'Y',
  injectableParam: 'Y',
  type: 'anything'
};
exports.hooks = {
  load: async (Logger, Variables, PluginTimer) => {
    ok(Variables)
    return {name: 'Y'}
  }
}
exports.commands = {};