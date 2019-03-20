const {InjectablePlugin, ApplicationPlugin} = require('@pomegranate/plugin-tools')
const {strictEqual} = require('assert')
let Plugin1 = InjectablePlugin({
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

let Plugin2 = InjectablePlugin({
  variables: {},
  directories: [],
  configuration: {
    name: 'Multiple2',
    type: 'anything',
    injectableParam: 'Multiple2',
    depends: []
  },
  hooks: {
    load: (Variables) => {
      return {name: 'Multiple2'}
    }
  },
  commands: {}
})

let Plugin3 = InjectablePlugin({
  variables: {},
  directories: [],
  configuration: {
    name: 'Multiple3',
    type: 'anything',
    injectableParam: 'Multiple3',
    depends: []
  },
  hooks: {
    load: (Variables) => {
      return {name: 'Multiple3'}
    }
  },
  commands: {}
})


exports.Plugin = ApplicationPlugin()
  .configuration({
    name: 'MultiplePlugin',
    type: 'application'
  })
  .applicationPlugins([
    Plugin1,
    Plugin2,
    Plugin3
  ])