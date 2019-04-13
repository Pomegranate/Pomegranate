/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const {CreatePlugin} = require('@pomegranate/plugin-tools')

exports.Plugin = CreatePlugin({
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
