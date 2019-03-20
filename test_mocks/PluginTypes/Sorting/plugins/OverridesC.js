const {strictEqual, equal, ok} = require('assert')
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')

exports.Plugin = InjectablePlugin()
  .variables({overriderName: 'OverridesC'})
  .directories(['Routes'])
  .configuration({
    name: 'OverridesC',
    type: 'override',
    depends: ['X']
  })
  .overrides('C')
  .hooks({
    load: (PluginLogger, PluginVariables, X) => {
      ok(PluginVariables)
      ok(PluginLogger)
      strictEqual(PluginVariables.overriderName, 'OverridesC-FromFile')
      strictEqual(X.name, 'X')
      return {name: 'C'}
    },
    start: () => {

    }
  })
