import {Defer} from "../Common/Defer";

/**
 * @file Timers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {PomegranateLogger} from "../FrameworkLogger";
import {getOr, reduce, set, toPairs} from 'lodash/fp'
import Bluebird from 'bluebird'

const NS_PER_SEC = 1e9


export function PluginTimer(pluginLogger: PomegranateLogger, initialTimeout: number){
  let deferred = Defer()
  let timer = null

  let clear = () => {
    clearTimeout(timer)
    timer = null
  }
  return {
    safePostponeDuration: initialTimeout * 0.75,
    start: function(){
      pluginLogger.log('Starting Hook Timeout.', 4)
      timer = setTimeout(() => {
        deferred.reject(new Error('Plugin timeout expired'))
      }, initialTimeout)
      return this.promise()
    },
    postponeTimeout: function(){
      pluginLogger.warn('Attempting to postpone hook timeout. Use this feature with great caution as it can deadlock the process.')
      clear()
      this.start()
    },
    reset: function () {
      pluginLogger.log('Reset hook timeout.', 4)

      clear()
      deferred = Defer()
    },
    promise: function(){
      return deferred.promise
    }
  }
}