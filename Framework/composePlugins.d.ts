import { ValidatedPlugin } from "./Plugin";
import Bluebird from 'bluebird';
import { MagnumDI } from "magnum-di";
import { LogManager } from "./FrameworkLogger/LogManager";
import { ValidatedTransformer } from "./Validation";
export declare const composePlugins: (FrameworkConfiguration: ValidatedTransformer, LogManager: LogManager, frameworkMetrics: any, loggerFactory: any, PluginDI: MagnumDI) => (skeletons: ValidatedPlugin[]) => Bluebird<any[]>;
