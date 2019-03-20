/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const {InjectablePlugin, ApplicationPlugin} = require('@pomegranate/plugin-tools')

let external1 = InjectablePlugin({
  variables: {name: 'external1'},
  directories: ['External1-work'],
  configuration: {
    name: 'External1',
    type: "anything",
    injectableParam: 'External1',
    depends: []
  },
  hooks: {
    load: (Variables) => {
      return {name: "External1"}
    }
  },
  commands: {}
})
let external2 = InjectablePlugin({
  variables: {},
  directories: ['External2-work'],
  configuration: {
    name: 'External2',
    type: "anything",
    injectableParam: 'External2',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name: "External2"}
    }
  },
  commands: {}
})

let external3 = ApplicationPlugin({
  configuration: {
    name: 'External3',
    type: "application",
  },
  applicationPlugins: [
    InjectablePlugin({
      variables: {},
      directories: ['ExternalChild1-work'],
      configuration: {
        name: 'ExternalChild1',
        type: "anything",
        injectableParam: 'ExternalChild1',
        depends: []
      },
      hooks: {
        load: () => {
          return {name: "ExternalChild1"}
        }
      },
      commands: {}
    }),
    InjectablePlugin({
      variables: {name: 'Child2-default'},
      // directories: [],
      configuration: {
        name: 'ExternalChild2',
        type: "anything",
        injectableParam: 'ExternalChild2',
        depends: []
      },
      hooks: {
        load: (pa) => {
          return {name: "ExternalChild2"}
        }
      },
      commands: {}
    })
  ]
})

exports.Plugin = ApplicationPlugin().configuration({
  name: 'ExternalApplication',
  type: 'application'
})
.applicationPlugins([
  external1,
  external2,
  external3
])