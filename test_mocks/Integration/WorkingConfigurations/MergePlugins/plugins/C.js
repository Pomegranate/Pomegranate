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

exports.variables = {};
exports.directories = [];
exports.configuration = {
  name: 'C',
  injectableParam: 'Merger',
  type: 'merge',
  depends: []
};
exports.hooks = {
  load: (PluginLogger, PluginVariables, Merger) => {

    strictEqual(Merger, null)
    return {C: 'C'}
  },
  start: (PluginLogger, Merger, PluginStore, PluginLateError) => {
    strictEqual(Merger.C, 'C')
  }
}
exports.commands = {};