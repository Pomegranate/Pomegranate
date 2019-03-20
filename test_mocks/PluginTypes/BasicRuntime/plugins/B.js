"use strict"

const {strictEqual, equal, ok} = require('assert')

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'B',
  type: 'action',
  depends: ['Y']
};
exports.hooks = {
  load: (Logger, Variables, Y) => {
    strictEqual(Y.name, 'Y')
  }
}
exports.commands = {};