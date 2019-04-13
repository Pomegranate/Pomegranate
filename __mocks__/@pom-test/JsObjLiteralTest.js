/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const {CreatePlugin} = require('@pomegranate/plugin-tools')
'use strict';

exports.Plugin = CreatePlugin({
  configuration: {
    name: 'JsObjLiteral',
    type: "action"
  },
  hooks: {
    load: () => {

    }
  }
})
// module.exports = {
//   variables: {},
//   directories: [],
//   configuration: {
//     name: 'JsObjLiteral',
//     type: "action"
//   },
//   hooks: {
//     load: () => {
//     }
//   },
//   commands: {}
// }