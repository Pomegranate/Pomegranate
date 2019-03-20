"use strict";
/**
 * @file Topological
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
// @ts-ignore
const indexedEach = fp_1.each.convert({ cap: false });
class Topological {
    constructor() {
        this.edges = [];
    }
    add(from, to) {
        if (!fp_1.isString(from) || !from) {
            throw new Error('from cannot be empty.');
        }
        let depArr = fp_1.isArray(to) ? to : fp_1.isUndefined(to) ? [] : [to];
        if (depArr.length) {
            fp_1.each((d) => {
                this.edges.push([from, d]);
            }, depArr);
        }
        else {
            this.edges.push([from]);
        }
        return this;
    }
    sort() {
        let nodes = fp_1.uniq(fp_1.flattenDeep(this.edges));
        let initial = nodes.length;
        let sorted = [];
        const visit = (node, pred) => {
            if (pred.length && fp_1.includes(node, pred)) {
                throw new Error('Cyclic Dependency. ' + node + ' Is dependent on itself.' +
                    '\n\t Dependency Chain: ' + pred.join(' -> ') + ' => ' + node);
            }
            let index = fp_1.indexOf(node, nodes);
            if (index !== -1) {
                let copy = [];
                //mark the node as false to exclude it from future iterations
                nodes[index] = false;
                //loop through all edges and follow dependencies of the current node
                fp_1.each((edge) => {
                    if (edge[0] === node) {
                        //lazily create a copy of predecessors with the current node concatenated onto it
                        copy = copy.length ? copy : pred.concat(node);
                        //recurse to node dependencies
                        visit(edge[1], copy);
                    }
                }, this.edges);
                sorted.push(node);
            }
        };
        indexedEach((node, i) => {
            if (node !== false) {
                nodes[i] = false;
                fp_1.each(function (edge) {
                    if (edge[0] === node) {
                        visit(edge[1], [node]);
                    }
                }, this.edges);
                sorted.push(node);
            }
        }, nodes);
        return sorted;
    }
}
exports.Topological = Topological;
//# sourceMappingURL=Topological.js.map