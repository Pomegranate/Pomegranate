const {strictEqual, equal, ok} = require('assert')
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
let plugin1 = InjectablePlugin({
  variables: {},
  directories: ['Multiple1-work'],
  configuration: {
    name: 'Multiple1',
    type: 'anything',
    injectableParam: 'Multiple1',
    depends: []
  },
  hooks: {
    load: (PluginVariables) => {
      strictEqual(PluginVariables.name, 'Multiple1-fromfile')
      return {name: 'Multiple1'}
    }
  },
  commands: {}
})
let plugin2 = InjectablePlugin({
  variables: {},
  directories: ['Multiple2-work'],
  configuration: {
    name: 'Multiple2',
    type: 'anything',
    injectableParam: 'Multiple2',
    depends: []
  },
  hooks: {
    load: (PluginVariables) => {
      strictEqual(PluginVariables.name, 'Multiple2-fromfile')
      return {name: 'Multiple2'}
    }
  },
  commands: {}
})
let plugin3 = ApplicationPlugin({
  configuration: {
    name: 'Multiple3',
    type: 'application'
  },
  applicationPlugins: [
    InjectablePlugin({
      variables: {},
      directories: ['Child1-work'],
      configuration: {
        name: 'Child1',
        type: 'anything',
        injectableParam: 'Child1',
        depends: []
      },
      hooks: {
        load: (PluginVariables) => {
          strictEqual(PluginVariables.name, 'Child1-fromfile')
          return {name: 'Child1'}
        }
      },
      commands: {}
    }),
    InjectablePlugin({
      variables: {name: 'Child2-default'},
      directories: [],
      configuration: {
        name: 'Child2',
        type: 'anything',
        injectableParam: 'Child2',
        depends: []
      },
      hooks: {
        load: (pa) => {
          return {name: 'Child2'}
        }
      },
      commands: {}
    })
  ]
})

exports.Plugin = ApplicationPlugin({
  configuration: {
    name: 'MultiplePlugin',
    type: 'application'
  },
  applicationPlugins: [
    plugin1,
    plugin2,
    plugin3
  ]
})
