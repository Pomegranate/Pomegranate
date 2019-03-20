"use strict";

const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin()
  .variables({a: 1})
  .directories()
  .configuration({
    name: 'Y',
    injectableParam: 'Y',
    type: 'anything',
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginLogger)
      ok(PluginVariables)
      return {name: 'Y'}
    }
  })