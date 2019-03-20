/**
 * @file FutureState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {cloneDeep, reduce} from 'lodash/fp'

export interface State {
  [key: string]: any
}

export interface Accumulator {
  [key: string]: any
}

export interface IFutureState<T> {
  getState: () => Promise<any>,
  map: (fn: (state: T, acc: Accumulator) => any | Promise<any>) => IFutureState<T>
  flatMap: (fn: (state: T, acc: Accumulator) => IFutureState<any> | Promise<IFutureState<any>>) => IFutureState<T>
  updateState: (fn: (state: T) => any) => IFutureState<T>
  run: (accumulator: Accumulator) => Promise<any>
}

export function FutureState<T>(state: {[key: string]: any}, collector = []): IFutureState<T> {
  return (function doCompose(){
    let clonedState = cloneDeep(state)
    return {
      getState: () => {
        return Promise.resolve(cloneDeep(state))
      },
      map: (fn: (state: any, acc: T)=> T) => {
        collector.push(fn)
        return doCompose()
      },
      flatMap: (fn) => {
        collector.push(async (s, c) => {
          let wf = await fn(s, c)
          state = await wf.getState()
          return state
        })
        return doCompose()
      },
      updateState: function(fn) {
        if(collector.length){
          throw new Error('StatePromise has unrun maps. .run() must be called before .updateState()')
        }
        state = fn(state)
        return doCompose()
      },
      run: async function (accumulator) {
        let acc = accumulator
        let c = collector
        collector = []
        let results = await reduce(async (future, item: any): Promise<any> => {
          await future
          let result = await Promise.resolve(item(clonedState, acc))
          acc = result
          return acc
        }, Promise.resolve(), c)

        return results
      }
    }
  })()
}

