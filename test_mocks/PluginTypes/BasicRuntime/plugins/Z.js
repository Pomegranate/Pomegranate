"use strict";
const {strictEqual, equal, ok} = require('assert')

exports.variables = {a: 1, b: 2};
exports.directories = [];
exports.configuration = {
  name: 'Z',
  injectableParam: 'Z',
  type: 'anything'
};
exports.hooks = {
  load: async (Logger, Variables, PluginTimer) => {
    Logger.log(Variables)
    ok(Variables)
    return {name: 'Z'}
  }
}
exports.commands = {};