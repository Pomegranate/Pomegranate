/**
 * @file PluginDirectories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {directoryBasePath} from "../../../src/Framework/Plugin/helpers";


describe('Plugin Directory base path', function () {
  test('Namespaced Multiple Plugin', () => {
    let plugin = {
      parents: ['A', 'B'],
      namespace: '@pom-test',
      configuration:
        {
          name: [
            '@pom-test',
            'A',
            'B',
            'CoolPlugin'
          ]
        }
    }
    let path = directoryBasePath(plugin)

    expect(path).toEqual('@pom-test/A/B/CoolPlugin')
  })

  test('Namespaced Plugin', () => {
    let plugin = {
      parents: [],
      namespace: '@pom-test',
      configuration:
        {
          name: [
            '@pom-test',
            'CoolPlugin'
          ]
        }
    }
    let path = directoryBasePath(plugin)

    expect(path).toEqual('@pom-test/CoolPlugin')
  })

  test('Local Multiple Plugin', () => {
    let plugin = {
      parents: ['A', 'B'],
      namespace: null,
      configuration:
        {
          name: [
            'A',
            'B',
            'CoolPlugin'
          ]
        }
    }
    let path = directoryBasePath(plugin)
    expect(path).toEqual('A/B/CoolPlugin')
  })

  test('Local Plugin', () => {
    let plugin = {
      parents: [],
      namespace: null,
      configuration:
        {
          name: [
            'CoolPlugin'
          ]
        }
    }
    let path = directoryBasePath(plugin)
    expect(path).toEqual('CoolPlugin')
  })
});