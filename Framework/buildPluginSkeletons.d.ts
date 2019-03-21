/**
 * @file buildPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { RuntimeFrameworkState } from "./Configuration";
import { PomegranatePlugin } from "@pomegranate/plugin-tools";
import { MagnumDI } from "magnum-di";
import { LogManager } from "./FrameworkLogger/LogManager";
export declare const buildPluginSkeletons: (FrameworkState: RuntimeFrameworkState, LogManager: LogManager, PluginInjector: MagnumDI) => (skeletons: PomegranatePlugin[]) => Promise<any[]>;