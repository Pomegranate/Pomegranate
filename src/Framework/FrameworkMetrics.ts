/**
 * @file FrameworkMetrics
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {getOr, get, set, isFunction} from 'lodash/fp'
import Bluebird from 'bluebird'

const NS_PER_SEC = 1e9


function toMillis([seconds, nanos]){
  // let hr = process.hrtime(comparator);
  let time = ( seconds * NS_PER_SEC + nanos ) / 1000000
  return Math.round(time * 1e3) / 1e3
}

export class PhaseMarker {
  private start
  private elapsed
  private elapsedMs
  constructor(){

  }

  markStart(){
    return this.start = process.hrtime()
  }
  markEnd(){
    if(!this.start) {throw new Error('markStart must be called before markEnd')}
    this.elapsed = process.hrtime(this.start)
    this.elapsedMs = toMillis(this.elapsed)
    return this.elapsedMs
  }
}

export interface Metrics {
  startFrameworkPhase: (phase: string) => [number, number]
  stopFrameworkPhase: (phase: string) => number
  startPluginPhase: (plugin: string, phase: string) => [number, number]
  stopPluginPhase: (plugin: string, phase: string) => number
  getMetrics: () => {framework: any, plugins: any}
}

export function FrameworkMetrics(): Metrics {
  let PluginMetrics = {}
  let RuntimeMetrics = {}

  return {
    startFrameworkPhase: (phase: string): [number, number] => {
      let p = new PhaseMarker()
      RuntimeMetrics = set(phase, p, RuntimeMetrics)
      return p.markStart()

    },
    stopFrameworkPhase: (phase: string): number => {
      let obj = getOr({}, phase, RuntimeMetrics)
      if(!isFunction(obj.markEnd)) {throw new Error(`Object path "${phase}" does not exist.`)}
      return obj.markEnd()

    },
    startPluginPhase: (plugin: string, phase: string): [number, number] => {
      let p = new PhaseMarker()
      PluginMetrics = set(`${plugin}.${phase}`, p, PluginMetrics)
      return p.markStart()
    },
    stopPluginPhase: (plugin: string, phase: string): number => {
      let obj = getOr({}, `${plugin}.${phase}`, PluginMetrics)
      if(!isFunction(obj.markEnd)) {throw new Error(`Object path "${plugin}.${phase}" does not exist.`)}
      return obj.markEnd()
    },
    getMetrics: (): {framework: any, plugins: any} => {
      return {
        framework: RuntimeMetrics,
        plugins: PluginMetrics
      }
    }
  }
}