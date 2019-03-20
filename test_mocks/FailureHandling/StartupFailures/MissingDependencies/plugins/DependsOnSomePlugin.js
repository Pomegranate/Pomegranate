"use strict";

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'DependsOnSomePlugin',
  type: 'instance',
  injectableParam: 'DependsOn',
  depends: ['SomePlugin']
};
exports.hooks = {
  load() {
  }
};
exports.commands = {};