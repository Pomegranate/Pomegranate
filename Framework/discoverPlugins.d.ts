/**
 * @file DiscoverPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from "bluebird";
import { PomegranatePlugin } from "@pomegranate/plugin-tools";
export declare const discoverFramework: (plugins: PomegranatePlugin[]) => Bluebird<any[]>;
export declare const discoverNamespaced: (dependencies: any) => Bluebird<any[]>;
export declare const discoverLocal: (pluginDirPath: any) => Bluebird<any[]> | Promise<any[]>;
