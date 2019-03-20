'use strict';

const {LoghandlerPlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = LoghandlerPlugin()
  .variables({a: 1})
  .configuration({
    name: 'LogHandler',
    type: 'loghandler'
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return function(a, b){
      }
    }
  })