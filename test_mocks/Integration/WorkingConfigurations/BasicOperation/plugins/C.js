/**
 * @file DependsOnSomeOther
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const {InjectablePlugin, ApplicationPlugin} = require('../../../../../Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin({
  configuration: {
    name: 'C',
    injectableParam: 'C',
    type: 'anything',
    depends: ['X']
  },
  hooks: {
    load: (PluginLogger, PluginVariables, X) => {
      strictEqual(X.name, 'X')
      return {name: 'C'}
    }
  }
})
exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'C',
  injectableParam: 'C',
  type: 'anything',
  depends: ['X']
};
exports.hooks = {
  load: (PluginLogger, PluginVariables, X) => {
    strictEqual(X.name, 'X')
    return {name: 'C'}
  }
}
exports.commands = {};