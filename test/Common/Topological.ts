/**
 * @file Topological
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Topological} from "../../src/Framework/Common/Topological";

describe('Topological sorting',() => {
  test('Throws on cyclical dependencies', () => {
    let topo = new Topological()
    topo
      .add('a', 'b')
      .add('b', 'c')
      .add('c', 'd')
      .add('d', 'b')
    expect(() => {
      let sorted = topo.sort()
    }).toThrow()
  })

  test('Throws on missing', () => {
    let topo = new Topological()
    expect(() => {
      // @ts-ignore
      topo.add()
    }).toThrow()
  })

  test('Finds Correct ordering.', () => {
    let topo = new Topological()
    let expected = [ 'e', 'd', 'c', 'b', 'a' ]
    topo
      .add('a', 'b')
      .add('b', 'c')
      .add('c', 'd')
      .add('d', 'e')
    expect(topo.sort()).toEqual(expected)
  })

  test('empty nodes', () => {
    let topo = new Topological()
    let expected = ['a', 'b', 'c']
    topo
      .add('a')
      .add('b')
      .add('c')
    expect(topo.sort()).toEqual(expected)
  })

  test('Multiple nodes', () => {
    let topo = new Topological()
    let expected = ['b', 'c', 'd', 'a']
    topo
      .add('a', ['b','c','d'])

    expect(topo.sort()).toEqual(expected)
  })

  test('Complex ordering', () => {
    let topo = new Topological()
    let expected = [ 'd', 'e', 'f', 'g', 'b', 'c', 'a', 'i', 'j', 'k', 'h' ]
    topo
      .add('a', ['b','c', 'd'])
      .add('b', ['d','e','f','g'])
      .add('h', ['i', 'j', 'k', 'a'])
      .add('k', ['j'])
      .add('j')

    expect(topo.sort()).toEqual(expected)
  })
})