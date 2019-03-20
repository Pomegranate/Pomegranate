/**
 * @file StatePromise
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {FutureState, IFutureState,State, Accumulator} from '../../src/Framework/Common/FutureState'

describe('Promise based monad like state store.', async () => {
  test('Immutability in states', async () => {
    let testState = {a: 1, b: 2}
    let state = {a: 1, b: 2}
    let ConfigState = FutureState(state)
      .map((state: any, acc) => {
        acc.a = state.a
        acc.b = state.b
        state.a = 3
        return acc
      })

    let results = await ConfigState.run({})
    expect(results).toEqual(expect.objectContaining(testState))

    let directState = await ConfigState.getState()
    expect(directState).toEqual(expect.objectContaining(testState))
    directState.a = 100

    expect(state).not.toEqual(directState)

  })
  test('Multiple maps', async () => {
    let Mapper = FutureState<{a?:number,b?:number,c?:number,d?:number}>({a: 1, b: 2, c: 3, d: 4})
      .map((state, acc) => {
        acc.a = state.a * 2
        return acc
      })
      .map((state, acc) => {
        acc.b = state.b * 2
        return acc
      })
      .map((state, acc) => {
        acc.c = state.c * 2
        return acc
      })
      .map((state, acc) => {
        acc.d = state.d * 2
        return acc
      })

     let results = await Mapper.run({})
  })
  test('updateState mutates state', async () => {
    let ConfigState = FutureState({a: 'b'})
      .updateState((state) => {
        return {c: 'd'}
      })
    let s = await ConfigState.getState()
    expect(s).toEqual({c: 'd'})
  })

  test('.flatMap mutates state', async () => {
    let testFlat = FutureState<{a: string}>({a: 'b'})
    let mapResult = await testFlat
      .map((state, collector) => {
        collector.a = state.a
        return collector
      })
      .flatMap((state, collector) => {
        return FutureState({flatMapped: true})
      })
      .map((state, collector) => {
        return {afterMap: true}
      })
      .run({})
    expect(testFlat.getState()).resolves.toEqual({flatMapped: true})
    expect(mapResult).toEqual({afterMap: true})
  })

  test('Throws when updateState is called with mappings queued.', async () => {
    let ConfigState = FutureState({a: 'b'})
      .map((state, acc) => {
        return acc
      })

    expect(() => {
      ConfigState.updateState(() => {

      })
    }).toThrow()
  })

  test('Preserves state through updateState', async () => {

    let updateLater = (fs: IFutureState<any>) => {
      return ()=>{
        return fs.updateState((state) => {
          state.a = state.a + 1
          state.b = state.b + 1
          return state
        })
          .getState()
      }
    }

    let mapLater = (fs: IFutureState<any>) => {
      return () => {
        return fs.map((state, acc) => {
          acc.a = state.a
          acc.b = state.b
          return acc
        })
          .run({})
      }
    }

    let FState = FutureState({a: 0, b: 0})

    let toUpdateLater = updateLater(FState)
    let toMapLater = mapLater(FState)
    let ml0 = await toMapLater()
    expect(ml0).toEqual({a: 0, b: 0})

    FState.updateState((state: any) => {
      return {a: state.a + 1, b: state.b + 1}
    })

    let toUpdateLater2 = await  toUpdateLater()
    let ml1 = await toMapLater()
    expect(ml1).toEqual({a: 2, b: 2})

    let toUpdateLater3 = await toUpdateLater()
    let ml2 = await toMapLater()
    expect(ml2).toEqual({a: 3, b: 3})

  })
});