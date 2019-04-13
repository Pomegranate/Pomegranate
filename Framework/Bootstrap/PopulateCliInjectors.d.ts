import { MagnumDI } from "magnum-di";
import { ComposedPlugin } from "../Plugin";
/**
 * @file PopulateCliInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare const PopulateCliInjectors: (GlobalInjector: MagnumDI, composed: ComposedPlugin[]) => ComposedPlugin[];
