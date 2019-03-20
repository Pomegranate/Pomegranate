/**
 * @file PopulateInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="node" />
import { MagnumDI } from "magnum-di";
import { ComposedPlugin } from "../Plugin";
import { EventEmitter } from 'events';
import { LogManager } from "../FrameworkLogger/LogManager";
export declare const PopulateInjectors: (LogManager: LogManager, frameworkMetrics: any, PluginDI: MagnumDI, FrameworkEvents: EventEmitter, composed: ComposedPlugin[]) => ComposedPlugin[];
