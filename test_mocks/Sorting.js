/**
 * @file ComplexOrdering
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

exports.simpleOrdering = [
  {configuration: {name: ['A'], depends: [], provides: []}},
  {configuration: {name: ['B'], depends: [], provides: []}},
  {configuration: {name: ['C'], depends: [], provides: []}},
  {configuration: {name: ['D'], depends: [], provides: []}},
  {configuration: {name: ['E'], depends: [], provides: []}},
  {configuration: {name: ['F'], depends: [], provides: []}},
  {configuration: {name: ['G'], depends: [], provides: []}},
  {configuration: {name: ['H'], depends: [], provides: []}}
]

//Expected ['Env', 'SequelizePg', 'Models', 'Controllers', 'Passport', 'PreMiddleware', 'Router', 'PostMiddleware']

exports.complexOrdering = [
  {configuration: {name: ['Env'], depends: [], provides: ['Env']}},
  {configuration: {name: ['SequelizePg'], depends: ['Env'], provides: ['SQL']}},
  {configuration: {name: ['Passport'], depends: ['Controllers'], provides: ['Middleware']}},
  {configuration: {name: ['Models'], depends: ['SequelizePg'], provides: []}},
  {configuration: {name: ['Controllers'], depends: ['Models'],provides: []}},
  {configuration: {name: ['Router'], depends: ['Controllers', 'PreMiddleware'], provides: []}},
  {configuration: {name: ['PreMiddleware'], depends: ['Controllers'],provides: []}},
  {configuration: {name: ['PostMiddleware'], depends: ['Router'],provides: []}}
]

//Expected ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'Routes', 'PreRouter', 'Setup]
exports.optionalOrdering = [
  {configuration: {name: ['Env'], depends: [], provides: []}},
  {configuration: {name: ['Merge'], depends: ['Env'], provides: 'Middleware'}},
  {configuration: {name: ['Passport'], depends: ['Merge'], provides: ['Middleware']}},
  {configuration: {name: ['Strategy'], depends: ['Passport'], provides: ['Middleware']}},
  {configuration: {name: ['Middleware'], depends: [], provides: []}},
  {configuration: {name: ['PreRouter'], depends: ['Middleware'], provides: [], optional: ['Routes']}},
  {configuration: {name: ['Routes'], depends: [], provides: []}},
  {configuration: {name: ['Setup']}}
]

//Expected [ 'ApplicationEnv','Middleware','Middleware2','Middleware3','TestParam' ,'SequelizePg','Router','ApplicationServer']
exports.parameterOrdering = [
  {configuration: {injectableParam: 'Test'      , name: ['TestParam'], depends: ['Middleware'], provides: ['Test']}},
  {configuration: {injectableParam: 'Env'       , name: ['ApplicationEnv'], depends: [], provides: ['Env']}},
  {configuration: {injectableParam: 'Server'    , name: ['ApplicationServer'], optional: ['Routes'], provides: ['Server']}},
  {configuration: {injectableParam: 'Routes'    , name: ['Router'], depends: ['SQL', 'Middleware'], provides: ['Routes']}},
  {configuration: {injectableParam: 'SQL'       , name: ['SequelizePg'], depends: ['Env'], provides: ['SQL']}},
  {configuration: {injectableParam: 'Middleware', name: ['Middleware'], depends: ['Env'], provides: []}},
  {configuration: {injectableParam: 'Middleware', name: ['Middleware2'], depends: ['Env'], provides: []}},
  {configuration: {injectableParam: 'Middleware', name: ['Middleware3'], depends: ['Env'], provides: []}}
]

//Expected ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'PreRouter']
exports.providesOrdering = [
  {configuration:{name: ['Env'], depends: [], provides: []}},
  {configuration:{name: ['Merge'], depends: ['Env'], provides: ['Middleware', 'Merge']}},
  {configuration:{name: ['Passport'], depends: ['Merge'], provides: ['Middleware']}},
  {configuration:{name: ['Strategy'], depends: ['Passport'], provides: ['Middleware']}},
  {configuration:{name: ['Middleware'], depends: [], provides: []}},
  {configuration:{name: ['PreRouter'], depends: ['Middleware'], provides: []}},
  {configuration:{name: ['Setup']}}
]

//Expected ['G','H','A','B','C','D','E','F']
exports.frameworkPlugins = [
  {configuration: {frameworkPlugin: false, name: ['A'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: false, name: ['B'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: false, name: ['C'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: false, name: ['D'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: false, name: ['E'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: false, name: ['F'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: true, name: ['G'], depends: [], provides: []}},
  {configuration: {frameworkPlugin: true, name: ['H'], depends: [], provides: []}}
]

exports.cyclicDependencies = [
  {configuration: {name: ['Env'], provides: [], depends: []}},
  {configuration: {name: ['SequelizePg'], provides: [], depends: ['Env']}},
  {configuration: {name: ['Models'], provides: [], depends: ['SequelizePg']}},
  {configuration: {name: ['Controllers'], provides: [], depends: ['Redis']}},
  {configuration: {name: ['Redis'], provides: [], depends: ['Middleware']}},
  {configuration: {name: ['Middleware'], provides: [], depends: ['Controllers']}}
]

exports.missingNames = [
  {configuration: {depends: [], provides: []}},
  {configuration: {name: 'B', depends: [], provides: []}}
]