// import {ProvidesAction} from "../../Working_Examples/plugins/ProvideTypes";

/**
 * @file MultiplePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


let plugin1 = {
  variables: {},
  directories: [],
  configuration: {
    name: 'MultiplePlugin1',
    type: "instance",
    injectableParam: 'Inject1',
    depends: []
  },
  hooks: {
    load: (pa) => {
      pa.setName('bob')
    }

  },

  commands: {}
}

let plugin2 = {
  variables: {},
  directories: [],
  configuration: {
    name: 'MultiplePlugin2',
    type: "instance",
    injectableParam: 'Inject2',
    depends: []
  },
  hooks: {
    load: (pa) => {
      pa.setName('bob')
    }

  },

  commands: {}
}

let plugin3 = {
  configuration: {
    name: 'MultiplePlugin3',
    type: "multiple",
  },
  multiplePlugins: [
    {
      variables: {},
      directories: [],
      configuration: {
        name: 'Child1',
        type: "instance",
        injectableParam: 'Child1',
        depends: []
      },
      hooks: {
        load: (pa) => {
          pa.setName('bob')
        }

      },

      commands: {}
    },
    {
      variables: {},
      directories: [],
      configuration: {
        name: 'Child2',
        type: "instance",
        injectableParam: 'Child2',
        depends: []
      },
      hooks: {
        load: (pa) => {
          pa.setName('bob')
        }

      },

      commands: {}
    }
  ]
}


export const configuration = {
  name: 'MultiplePlugin',
  type: 'multiple'
}

export const multiplePlugins = [
  plugin1,
  plugin2,
  plugin3
]