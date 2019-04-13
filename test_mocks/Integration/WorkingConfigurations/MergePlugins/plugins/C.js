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
    injectableParam: 'Merger',
    type: 'merge',
    depends: []
  },
 hooks: {
  load: (PluginLogger, PluginVariables, Merger) => {

    strictEqual(Merger, null)
    return {C: 'C'}
  },
  start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
    strictEqual(Merger.C, 'C')
  }
}
})
