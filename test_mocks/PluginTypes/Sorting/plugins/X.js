"use strict";
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin()
  .variables({a: 1})
  .directories()
  .configuration({
    name: 'X',
    injectableParam: 'X',
    type: 'anything',
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginLogger)
      ok(PluginVariables)
      ok(PluginTimer)
      return {name: 'X'}
    }
  })