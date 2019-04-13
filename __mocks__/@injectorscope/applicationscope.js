/**
 * @file JsTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const {InjectablePlugin, ApplicationPlugin, CreatePlugin} = require('@pomegranate/plugin-tools')
const {ok, strictEqual} = require('assert')

let external1 = CreatePlugin({
  variables: {name: 'external1'},
  directories: [],
  configuration: {
    name: 'External1',
    type: 'anything',
    injectableParam: 'External1',
    injectableScope: 'application',
    depends: []
  },
  hooks: {
    load: (Variables) => {
      return {name: 'External1'}
    }
  },
  commands: {}
})
let external2 = CreatePlugin({
  variables: {},
  directories: [],
  configuration: {
    name: 'External2',
    type: 'anything',
    injectableParam: 'External2',
    injectableScope: 'namespace',
    depends: ['@injectorscope/External1']
  },
  hooks: {
    load: (pa, External1) => {
      strictEqual(External1.name, 'External1')
      return {name: 'External2'}
    }
  },
  commands: {}
})

let external3 = CreatePlugin({
  configuration: {
    name: 'External3',
    type: 'application'
  },
  applicationPlugins: [
    CreatePlugin({
      variables: {},
      directories: [],
      configuration: {
        name: 'ExternalChild1',
        type: 'anything',
        injectableParam: 'ExternalChild1',
        depends: ['@injectorscope/External2']
      },
      hooks: {
        load: (External2) => {
          strictEqual(External2.name, 'External2')
          return {name: 'ExternalChild1'}
        }
      },
      commands: {}
    }),
    CreatePlugin({
      variables: {name: 'Child2-default'},
      // directories: [],
      configuration: {
        name: 'ExternalChild2',
        type: 'anything',
        injectableParam: 'ExternalChild2',
        depends: []
      },
      hooks: {
        load: (pa) => {
          return {name: 'ExternalChild2'}
        }
      },
      commands: {}
    })
  ]
})

exports.Plugin = CreatePlugin('application')
  .configuration({
    name: 'ExternalApplication'
  })
  .applicationPlugins([
    external1,
    external2,
    external3
  ])