/**
 * @file TopologicalSorting
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {solveOrdering} from "../src/Framework/Common/solveOrdering";
import * as mocks from '../test_mocks/Sorting'

describe('Topological plugin sort', () => {
  test('Simple Ordering', () => {
    let expected = ['A', 'B','C','D','E','F','G','H']
    expect(solveOrdering(mocks.simpleOrdering) ).toEqual(expected)
  })
  test('Complex Ordering', () => {
    let expected = ['Env', 'SequelizePg', 'Models', 'Controllers', 'Passport', 'PreMiddleware', 'Router', 'PostMiddleware']
    expect(solveOrdering(mocks.complexOrdering) ).toEqual(expected)
  })
  test('Optional Ordering', () => {
    let expected = ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'Routes', 'PreRouter', 'Setup']
    expect(solveOrdering(mocks.optionalOrdering) ).toEqual(expected)
  })
  test('Parameter Ordering', () => {
    let expected = [ 'ApplicationEnv','Middleware','Middleware2','Middleware3','TestParam' ,'SequelizePg','Router','ApplicationServer']
    expect(solveOrdering(mocks.parameterOrdering) ).toEqual(expected)
  })
  test('Provides Ordering', () => {
    let expected = ['Env', 'Merge', 'Passport', 'Strategy', 'Middleware', 'PreRouter', 'Setup']
    expect(solveOrdering(mocks.providesOrdering) ).toEqual(expected)
  })

  test('Framework Plugins come first.', () => {
    let expected = ['G','H','A','B','C','D','E','F']
    expect(solveOrdering(mocks.frameworkPlugins) ).toEqual(expected)
  })

  test('Cyclic dependencies throw', () => {
    expect(() => {
      try{
        solveOrdering(mocks.cyclicDependencies)
      }
      catch(e){
        throw e
      }
    }).toThrow(expect.any(Error))
  })

  test('Missing "from" throws ', () => {
    expect(() => {
      solveOrdering(mocks.missingNames)
    }).toThrow(expect.any(Error))
  })
});