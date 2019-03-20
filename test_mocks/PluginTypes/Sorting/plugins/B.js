"use strict"
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')
exports.Plugin = InjectablePlugin()
  .variables()
  .directories()
  .configuration({
  name: 'B',
  type: 'action',
  depends: ['Y']
})
  .hooks({
  load: (Logger, Variables, Y) => {
    strictEqual(Y.name, 'Y')
  }
})