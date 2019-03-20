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
  name: 'C',
  injectableParam: 'C',
  type: 'anything',
  depends: ['X']
};
exports.hooks = {
  load: (Logger, Variables, X) => {
    strictEqual(X.name, 'X')
    return {name: 'C'}
  }
}
exports.commands = {};