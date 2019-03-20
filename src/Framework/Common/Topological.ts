/**
 * @file Topological
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {isString, isArray, isUndefined, each, flattenDeep, uniq, indexOf, includes} from 'lodash/fp'

// @ts-ignore
const indexedEach = each.convert({cap: false})

export class Topological {
  private edges

  constructor() {
    this.edges = []
  }

  add(from: string, to?: string | string[]): Topological {
    if (!isString(from) || !from) {
      throw new Error('from cannot be empty.')
    }

    let depArr = isArray(to) ? to : isUndefined(to) ? [] : [to]

    if (depArr.length) {
      each((d) => {
        this.edges.push([from, d])
      }, depArr)
    } else {
      this.edges.push([from])
    }

    return this
  }

  sort(){
    let nodes = uniq(flattenDeep(this.edges))
    let initial = nodes.length
    let sorted = []

    const visit = (node: string, pred: string[]) => {
      if (pred.length && includes(node, pred)) {
        throw new Error('Cyclic Dependency. ' + node + ' Is dependent on itself.' +
          '\n\t Dependency Chain: ' + pred.join(' -> ') + ' => ' + node)
      }

      let index = indexOf(node, nodes)
      if (index !== -1) {
        let copy = []

        //mark the node as false to exclude it from future iterations
        nodes[index] = false

        //loop through all edges and follow dependencies of the current node
        each((edge) => {
          if (edge[0] === node) {
            //lazily create a copy of predecessors with the current node concatenated onto it
            copy = copy.length ? copy : pred.concat(node)

            //recurse to node dependencies
            visit(edge[1], copy);
          }
        },this.edges)
        sorted.push(node)
      }
    }

    indexedEach((node, i) => {

      if (node !== false) {
        nodes[i] = false

        each(function (edge) {
          if (edge[0] === node) {
            visit(edge[1], [node])
          }
        },this.edges)

        sorted.push(node)
      }
    }, nodes)


    return sorted
  }
}