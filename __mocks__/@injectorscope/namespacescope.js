const {CreatePlugin} = require('@pomegranate/plugin-tools')
const {ok, strictEqual} = require('assert')

let NSOnly= CreatePlugin({
  variables: {name: 'nsonly'},
  directories: [],
  configuration: {
    name: 'NSOnly',
    type: "anything",
    injectableParam: 'NSOnly',
    injectableScope: 'global',
    depends: ['@injectorscope/External1','@injectorscope/External2']
  },
  hooks: {
    load: (Variables, External1, External2) => {
      strictEqual(External1, null)
      strictEqual(External2.name, 'External2')
      return {name: "NSOnly"}
    }
  },
  commands: {}
})

exports.Plugin = NSOnly