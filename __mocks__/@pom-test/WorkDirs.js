/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const {InjectablePlugin} = require('@pomegranate/plugin-tools')

exports.Plugin = InjectablePlugin({
  variables: {name: 'WorkDirs'},
  directories: ['someDir'],
  configuration: {
    name: 'WorkDirs',
    type: "action"
  },
  hooks: {
    load: (Variables) => {
    }
  },
  commands: {}
})
