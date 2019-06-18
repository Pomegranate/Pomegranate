/**
 * @file ComplexOrdering
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

function buildMocks(mocks) {
  return mocks.map((mock) => {
    mock.computedMetadata = {
      fqn: [mock.state.configuration.name]
    }
    return mock
  })
}

exports.simpleOrdering = buildMocks([
  {state: {configuration: {name: 'A', depends: [], provides: []}}},
  {state: {configuration: {name: 'B', depends: [], provides: []}}},
  {state: {configuration: {name: 'C', depends: [], provides: []}}},
  {state: {configuration: {name: 'D', depends: [], provides: []}}},
  {state: {configuration: {name: 'E', depends: [], provides: []}}},
  {state: {configuration: {name: 'F', depends: [], provides: []}}},
  {state: {configuration: {name: 'G', depends: [], provides: []}}},
  {state: {configuration: {name: 'H', depends: [], provides: []}}}
])

exports.emptyFirst = buildMocks([
  {state: {configuration: {name: 'A', depends: ['B'], provides: []}}},
  {state: {configuration: {name: 'B', depends: ['C'], provides: []}}},
  {state: {configuration: {name: 'C', depends: ['D'], provides: []}}},
  {state: {configuration: {name: 'D', depends: ['E'], provides: []}}},
  {state: {configuration: {name: 'E', depends: ['F'], provides: []}}},
  {state: {configuration: {name: 'F', depends: [], provides: []}}},
  {state: {configuration: {name: 'G', depends: [], provides: []}}},
  {state: {configuration: {name: 'H', depends: [], provides: []}}}
])

exports.runtimeAdditional = buildMocks([
  {
    state: {configuration: {name: 'A', depends: ['B'], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'B', depends: ['C'], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'C', depends: ['D'], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'D', depends: ['E'], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'E', depends: ['F'], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'F', depends: [], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  },
  {
    state: {configuration: {name: 'G', depends: [], provides: []}},
    runtimeConfiguration: {additionalDependencies: ['A']}
  },
  {
    state: {configuration: {name: 'H', depends: [], provides: []}},
    runtimeConfiguration: {additionalDependencies: []}
  }
])

//Expected ['Env', 'SequelizePg', 'Models', 'Controllers', 'Passport', 'PreMiddleware', 'Router', 'PostMiddleware']

exports.complexOrdering = buildMocks([
  {state: {configuration: {name: 'Env', depends: [], provides: ['Env']}}},
  {state: {configuration: {name: 'SequelizePg', depends: ['Env'], provides: ['SQL']}}},
  {state: {configuration: {name: 'Passport', depends: ['Controllers'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Models', depends: ['SequelizePg'], provides: []}}},
  {state: {configuration: {name: 'Controllers', depends: ['Models'], provides: []}}},
  {state: {configuration: {name: 'Router', depends: ['Controllers', 'PreMiddleware'], provides: []}}},
  {state: {configuration: {name: 'PreMiddleware', depends: ['Controllers'], provides: []}}},
  {state: {configuration: {name: 'PostMiddleware', depends: ['Router'], provides: []}}}
])

//Expected ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'Routes', 'Setup','PreRouter' ]
exports.optionalOrdering = buildMocks([
  {state: {configuration: {name: 'Env', depends: [], provides: []}}},
  {state: {configuration: {name: 'Merge', depends: ['Env'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Passport', depends: ['Merge'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Strategy', depends: ['Passport'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Middleware', depends: [], provides: []}}},
  {state: {configuration: {name: 'PreRouter', depends: ['Middleware'], provides: [], optional: ['Routes']}}},
  {state: {configuration: {name: 'Routes', depends: [], provides: []}}},
  {state: {configuration: {name: 'Setup'}}}
])

//Expected [ 'ApplicationEnv','Middleware','Middleware2','Middleware3','TestParam' ,'SequelizePg','Router','ApplicationServer']
exports.parameterOrdering = buildMocks([
  {state: {configuration: {injectableParam: 'Test', name: 'TestParam', depends: ['Middleware'], provides: ['Test']}}},
  {state: {configuration: {injectableParam: 'Env', name: 'ApplicationEnv', depends: [], provides: ['Env']}}},
  {
    state: {
      configuration: {
        injectableParam: 'Server',
        name: 'ApplicationServer',
        optional: ['Routes'],
        provides: ['Server']
      }
    }
  },
  {
    state: {
      configuration: {
        injectableParam: 'Routes',
        name: 'Router',
        depends: ['SQL', 'Middleware'],
        provides: ['Routes']
      }
    }
  },
  {state: {configuration: {injectableParam: 'SQL', name: 'SequelizePg', depends: ['Env'], provides: ['SQL']}}},
  {state: {configuration: {injectableParam: 'Middleware', name: 'Middleware', depends: ['Env'], provides: []}}},
  {state: {configuration: {injectableParam: 'Middleware', name: 'Middleware2', depends: ['Env'], provides: []}}},
  {state: {configuration: {injectableParam: 'Middleware', name: 'Middleware3', depends: ['Env'], provides: []}}}
])

//Expected ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'Setup','PreRouter']
exports.providesOrdering = buildMocks([
  {state: {configuration: {name: 'Env', depends: [], provides: []}}},
  {state: {configuration: {name: 'Merge', depends: ['Env'], provides: ['Middleware', 'Merge']}}},
  {state: {configuration: {name: 'Passport', depends: ['Merge'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Strategy', depends: ['Passport'], provides: ['Middleware']}}},
  {state: {configuration: {name: 'Middleware', depends: [], provides: []}}},
  {state: {configuration: {name: 'PreRouter', depends: ['Middleware'], provides: []}}},
  {state: {configuration: {name: 'Setup'}}}
])

//Expected ['G','H','A','B','C','D','E','F']
exports.frameworkPlugins = buildMocks([
  {state: {configuration: {frameworkPlugin: false, name: 'A', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: false, name: 'B', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: false, name: 'C', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: false, name: 'D', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: false, name: 'E', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: false, name: 'F', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: true, name: 'G', depends: [], provides: []}}},
  {state: {configuration: {frameworkPlugin: true, name: 'H', depends: [], provides: []}}}
])

exports.cyclicDependencies = buildMocks([
  {state: {configuration: {name: 'Env', provides: [], depends: []}}},
  {state: {configuration: {name: 'SequelizePg', provides: [], depends: ['Env']}}},
  {state: {configuration: {name: 'Models', provides: [], depends: ['SequelizePg']}}},
  {state: {configuration: {name: 'Controllers', provides: [], depends: ['Redis']}}},
  {state: {configuration: {name: 'Redis', provides: [], depends: ['Middleware']}}},
  {state: {configuration: {name: 'Middleware', provides: [], depends: ['Controllers']}}}
])

exports.missingNames = buildMocks([
  {state: {configuration: {depends: [], provides: []}}},
  {state: {configuration: {name: 'B', depends: [], provides: []}}}
])