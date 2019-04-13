const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {strictEqual} = require('assert')

let plugin1 = CreatePlugin({
  variables: {},
  configuration: {
    name: 'Merge1',
    type: "merge",
    injectableParam: 'Merger',
    injectableScope: 'application',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name1: "Merge1"}
    }
  },
  commands: {}
})
let plugin2 = CreatePlugin({
  variables: {},
  configuration: {
    name: 'Merge2',
    type: "merge",
    injectableParam: 'Merger',
    injectableScope: 'application',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name2: "Merge2"}
    }
  },
  commands: {}
})

let plugin3 = CreatePlugin({
  variables: {},
  configuration: {
    name: 'Merge3',
    type: "merge",
    injectableParam: 'Merger',
    injectableScope: 'application',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name3: "Merge3"}
    }
  },
  commands: {}
})

let plugin4 = CreatePlugin({
  variables: {},
  configuration: {
    name: 'TestMerge',
    type: "action",
    depends: ['Merge1', 'Merge2', 'Merge3']
  },
  hooks: {
    load: (Merger, Injector) => {
      strictEqual(Merger.name1, 'Merge1')
      strictEqual(Merger.name2, 'Merge2')
      strictEqual(Merger.name3, 'Merge3')
      return {name: "Merge1"}
    }
  },
  commands: {}
})



exports.Plugin = CreatePlugin({
  configuration: {
    name: 'MultiplePlugin',
    type: 'application'
  },
  applicationPlugins: [
    plugin1,
    plugin2,
    plugin3,
    plugin4

  ]
})