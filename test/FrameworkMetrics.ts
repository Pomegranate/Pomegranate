/**
 * @file FrameworkMetrics
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {isNumber} from 'lodash'

import {FrameworkMetrics, PhaseMarker} from "../src/Framework/FrameworkMetrics";

describe('Framework Metrics', () => {
  test('Runtime timings', async () => {
    let metrics = FrameworkMetrics()
    let [seconds, nanos] = metrics.startFrameworkPhase('pluginDiscovery')
    expect(seconds).toBeGreaterThanOrEqual(0)
    expect(nanos).toBeGreaterThan(0)

    let elapsed = metrics.stopFrameworkPhase('pluginDiscovery')

    expect(metrics.getMetrics()).toEqual(expect.objectContaining({
      framework: {
        pluginDiscovery: expect.any(PhaseMarker)
      },
      plugins: {}
    }))

  })
  test('Plugin Timings', () => {
    let metrics = FrameworkMetrics()
    metrics.startPluginPhase('Env', 'configure')
    metrics.stopPluginPhase('Env', 'configure')
    metrics.startPluginPhase('Env', 'validate')
    metrics.stopPluginPhase('Env', 'validate')
    metrics.startPluginPhase('Env', 'load')
    metrics.stopPluginPhase('Env', 'load')

    metrics.startPluginPhase('@ns/plugin', 'configure')
    metrics.stopPluginPhase('@ns/plugin', 'configure')
    metrics.startPluginPhase('@ns/plugin', 'validate')
    metrics.stopPluginPhase('@ns/plugin', 'validate')
    metrics.startPluginPhase('@ns/plugin', 'load')
    metrics.stopPluginPhase('@ns/plugin', 'load')


    expect(metrics.getMetrics()).toEqual(expect.objectContaining({
      framework: {},
      plugins: {
        Env: {
          configure: expect.any(PhaseMarker),
          validate: expect.any(PhaseMarker),
          load: expect.any(PhaseMarker)
        },
        "@ns/plugin": {
          configure: expect.any(PhaseMarker),
          validate: expect.any(PhaseMarker),
          load: expect.any(PhaseMarker)
        }
      }
    }))
  })

  test('Throws with bad args', () => {
    let metrics = FrameworkMetrics()

    expect(() => {
       metrics.stopFrameworkPhase('missing')
    }).toThrow()

    expect(() => {
      metrics.stopPluginPhase('missing', 'load')
    }).toThrow()

  })
});