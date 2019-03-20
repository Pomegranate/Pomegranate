import { ValidatedPlugin } from "./Plugin";
import Bluebird from 'bluebird';
import { ComposedFrameworkState } from "./Configuration";
import { MagnumDI } from "magnum-di";
import { LogManager } from "./FrameworkLogger/LogManager";
export declare const composePlugins: (pomConf: ComposedFrameworkState, LogManager: LogManager, frameworkMetrics: any, loggerFactory: any, PluginDI: MagnumDI) => (skeletons: ValidatedPlugin[]) => Bluebird<any[]>;
