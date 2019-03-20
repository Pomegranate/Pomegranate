/**
 * @file Defer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import Bluebird from 'bluebird'

export function Defer(){
  let resolve, reject
  const p = new Bluebird((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    resolve: resolve,
    reject: reject,
    promise: p
  }
}