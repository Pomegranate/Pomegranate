"use strict";
const {strictEqual, equal, ok} = require('assert')

exports.variables = {a: 1};
exports.directories = [];
exports.configuration = {
  name: 'AnyTest',
  injectableParam: 'AnyTest',
  type: 'anything'
};
exports.hooks = {
  load: async (Logger, Variables, PluginTimer) => {
    ok(Variables)
    return new Promise((resolve) => {
      function recycle(count){
        if(!--count){
          resolve({name: 'AnyTest'})
          return
        }
        PluginTimer.postponeTimeout()

        setTimeout(() => {

          recycle(count)
        }, PluginTimer.safePostponeDuration)
      }
      recycle(2)
    })
  }
}
exports.commands = {};