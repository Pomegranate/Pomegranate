"use strict"

const {strictEqual, equal, ok} = require('assert')

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'AssertsDependsAny',
  injectableParam: 'SomeOther',
  type: 'anything',
  depends: ['AnyTest']
};
exports.hooks = {
  load: (Logger, Variables, AnyTest) => {

    ok(AnyTest)
    equal(AnyTest.name, 'AnyTest')
    return {name: 'SomeOther'}
  }
}
exports.commands = {};