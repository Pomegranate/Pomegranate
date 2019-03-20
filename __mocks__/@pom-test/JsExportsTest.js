/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const {InjectablePlugin} = require('@pomegranate/plugin-tools')
'use strict';

exports.Plugin = InjectablePlugin({
  configuration: {
    name: 'JsExportsTest',
    type: "action"
  },
  hooks: {
    load: () => {

    }
  }
})


exports.variables = {}
exports.directories = []
exports.configuration = {
  name: 'JsExportsTest',
  type: 'action'
}
exports.hooks = {
  load: () => {
  }
}

exports.commands = {}