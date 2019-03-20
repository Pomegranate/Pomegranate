/**
 * @file structureInjectables
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "magnum-di";
import {structureInjectables} from "../../src/Framework/Plugin/runHook";
import {PomLogManager} from "../../src/Framework/FrameworkLogger/LogManager";

describe('Structuring Injectables', () => {
  test('Unrolling Composite plugins', () => {
    let LogManager = PomLogManager()
    let Injector = new MagnumDI()
    let PluginInjector = Injector.createChild()

    let plugin = {
      logger: LogManager.createLogger({source: 'test', logLevel: 4}),
      configuration: {
        name: 'A',
        type: 'composite'
      }
    }
    let injectableResult = [
      {value: {name: 'bob'}, injectableParam: 'bob', type: 'anything'},
      {value: {name: 'tom'}, injectableParam: 'tom', type: 'anything'},
      {value: {name: 'sue'}, injectableParam: 'sue', type: 'anything'},
      {
        value: [
          {value: {name: 'tony'}, injectableParam: 'tony', type: 'anything'},
          {value: {name: 'mike'}, injectableParam: 'mike', type: 'anything'},
          {value: {name: 'adam'}, injectableParam: 'adam', type: 'anything'},
          {value: [
              {value: {name: 'james'}, injectableParam: 'james', type: 'anything'},
              {value: {name: 'pierce'}, injectableParam: 'pierce', type: 'anything'},
              {value: {name: 'betty'}, injectableParam: 'betty', type: 'anything'},
            ],
            type: 'composite'},
        ],
        type: 'composite'},
    ]

    // @ts-ignore
    structureInjectables(injectableResult, plugin, LogManager.use('test'), PluginInjector,LogManager)
    expect(Injector.get('bob')).toEqual({name: 'bob'})
    expect(Injector.get('tom')).toEqual({name: 'tom'})
    expect(Injector.get('sue')).toEqual({name: 'sue'})
    expect(Injector.get('tony')).toEqual({name: 'tony'})
    expect(Injector.get('mike')).toEqual({name: 'mike'})
    expect(Injector.get('adam')).toEqual({name: 'adam'})
    expect(Injector.get('james')).toEqual({name: 'james'})
    expect(Injector.get('pierce')).toEqual({name: 'pierce'})
    expect(Injector.get('betty')).toEqual({name: 'betty'})
  })
});