"use strict";

const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin()
  .variables({a: 1, b: 2})
  .directories()
  .configuration({
    name: 'Z',
    injectableParam: 'Z',
    type: 'anything',
  })
  .hooks({
    load: async (Logger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return {name: 'Z'}
    }
  })