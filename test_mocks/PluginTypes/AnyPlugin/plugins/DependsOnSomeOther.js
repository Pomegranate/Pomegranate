/**
 * @file DependsOnSomeOther
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const {strictEqual, equal, ok} = require('assert')

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'DependsOnSomeOther',
  injectableParam: 'DedpendsOn',
  type: 'anything',
  depends: ['SomeOther']
};
exports.hooks = {
  load: (Logger, Variables, SomeOther) => {
    ok(SomeOther)
    equal(SomeOther.name, 'SomeOther')
    return {name: 'DependsOn'}
  }
}
exports.commands = {};