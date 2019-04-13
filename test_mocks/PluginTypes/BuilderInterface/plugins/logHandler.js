'use strict';

const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = CreatePlugin('loghandler')
  .variables({a: 1})
  .configuration({
    name: 'LogHandler'
  })
  .hooks({
    load: async (PluginLogger, PluginVariables, PluginTimer) => {
      ok(PluginVariables)
      return function(a, b){
      }
    }
  })