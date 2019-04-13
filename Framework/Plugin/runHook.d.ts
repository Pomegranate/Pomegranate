import { MagnumDI } from "magnum-di";
import { ComposedPlugin } from ".";
import { ValidatedConfiguration } from "../Configuration";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare function placeInjectables(composedPlugin: any, hookResult: any, pluginLogger: any, GlobalInjector: MagnumDI, LogManager: any): any;
export declare function composeHookRunners(frameworkConf: ValidatedConfiguration, LogManager: LogManager, GlobalInjector: MagnumDI): {
    runLoadHook: (composedPlugin: ComposedPlugin) => Promise<any>;
    runStartHook: (composedPlugin: ComposedPlugin) => Promise<any>;
    runStopHook: (composedPlugin: ComposedPlugin) => Promise<any>;
};
