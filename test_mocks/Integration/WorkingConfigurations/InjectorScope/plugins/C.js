/**
 * @file DependsOnSomeOther
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin({
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