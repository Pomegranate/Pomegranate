/**
 * @file configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare const buildConfiguration: (PomInstance: any) => (argv: any) => Bluebird<[any, any][]>;
