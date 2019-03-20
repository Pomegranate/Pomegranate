"use strict";
const {strictEqual, equal, ok} = require('assert')

exports.variables = {a: 1, b: 2, c: 3};
// exports.directories = ['stuff', 'other/stuff'];
exports.directories = [
  {prop: 'stuff', path: 'stuff'},
  {prop: 'other', path: 'other/stuff'}
];

exports.configuration = {
  name: 'A',
  injectableParam: 'A',
  type: 'anything',
  depends: ['Z']
};
exports.hooks = {
  load: async (Logger, Variables, Z, PluginStore) => {
    PluginStore.name = 'A'
    strictEqual(Z.name, 'Z')
    ok(Variables)
    // throw new Error('Wubba lubba')
    return {name: 'A'}
  },
  start: (Logger, A, PluginStore) => {
    strictEqual(PluginStore.name, 'A')
    strictEqual(A.name, 'A')
    throw new Error('Wubba lubba')
  }
}
exports.commands = {};