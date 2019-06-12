/**
 * @file PluginFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="lodash" />
import { ComposedPlugin } from "./index";
export declare const PluginFilesFactory: (plugin: any) => (prop: string) => any;
export declare const createPluginFilesObj: (a1: object | ArrayLike<ComposedPlugin>) => import("lodash").Dictionary<any>;
export declare const pickDirectory: (pluginDirObj: any) => (pluginName: any, dirProp: any) => any;
