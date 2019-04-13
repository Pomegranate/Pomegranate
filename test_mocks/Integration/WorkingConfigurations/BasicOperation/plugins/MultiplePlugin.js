const {CreatePlugin} = require('@pomegranate/plugin-tools')




let plugin1 = CreatePlugin({
  variables: {},
  directories: ['Multiple1-work'],
  configuration: {
    name: 'Multiple1',
    type: "anything",
    injectableParam: 'Multiple1',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name: "Multiple1"}
    }
  },
  commands: {}
})
let plugin2 = CreatePlugin({
  variables: {},
  directories: ['Multiple2-work'],
  configuration: {
    name: 'Multiple2',
    type: "anything",
    injectableParam: 'Multiple2',
    depends: []
  },
  hooks: {
    load: (pa) => {
      return {name: "Multiple2"}
    }
  },
  commands: {}
})
let plugin3 = CreatePlugin({
  configuration: {
    name: 'Multiple3',
    type: "application",
  },
  applicationPlugins: [
    CreatePlugin({
      variables: {},
      directories: ['Child1-work'],
      configuration: {
        name: 'Child1',
        type: "anything",
        injectableParam: 'Child1',
        depends: []
      },
      hooks: {
        load: () => {
          return {name: "Child1"}
        }
      },
      commands: {}
    }),
    CreatePlugin({
      variables: {name: 'Child2-default'},
      directories: [],
      configuration: {
        name: 'Child2',
        type: "anything",
        injectableParam: 'Child2',
        depends: []
      },
      hooks: {
        load: (pa) => {
          return {name: "Child2"}
        }
      },
      commands: {}
    })
  ]
})

exports.Plugin = CreatePlugin({
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