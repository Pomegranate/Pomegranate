/**
 * @file Timings
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {getOr, reduce, set, toPairs} from "lodash/fp";
const NS_PER_SEC = 1e9

function toMillis(comparator){
  let hr = process.hrtime(comparator);
  let time = ( hr[0] * NS_PER_SEC + hr[1] ) / 1000000
  return `${time.toFixed(2)}ms`
}

export function pluginTimings(){
  let timings = {
    initialize: {
      start: null,
      elapsedMs: null
    },
    validate: {
      start: null,
      elapsedMs: null
    },
    populate: {
      start: null,
      elapsedMs: null
    },
    load: {
      start: null,
      elapsedMs: null
    },
    start: {
      start: null,
      elapsedMs: null
    },
    stop: {
      start: null,
      elapsedMs: null
    }
  }

  return {
    startFrameworkPhase: (hook: string) => {
      timings[hook] = {start:  process.hrtime()}
    },
    stopFrameworkPhase: (hook: string) => {
      let endMs = timings[hook].elapsedMs = toMillis(timings[hook].start)
      return endMs
    },
    getHookDuration: (hook) =>{
      return getOr(null, `${hook}.elapsedMs`, timings)
    },
    getDurations: () => {
      reduce((acc, [key, value]) => {
        return set(key, value, acc)
      }, {}, toPairs(timings))
    }
  }
}