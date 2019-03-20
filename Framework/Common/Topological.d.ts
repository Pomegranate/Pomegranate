/**
 * @file Topological
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare class Topological {
    private edges;
    constructor();
    add(from: string, to?: string | string[]): Topological;
    sort(): any[];
}
