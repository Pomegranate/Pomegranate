/**
 * @file Defer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare function Defer(): {
    resolve: any;
    reject: any;
    promise: Bluebird<{}>;
};
