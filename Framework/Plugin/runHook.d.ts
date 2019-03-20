import { MagnumDI } from "magnum-di";
import { ComposedPlugin } from ".";
import { ValidatedConfiguration } from "../Configuration";
import { PomegranateLogger } from "../FrameworkLogger";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare function structureInjectables(result: any, composedPlugin: ComposedPlugin, pluginLogger: PomegranateLogger, pluginInjector: MagnumDI, LogManager: any): any;
export declare function composeHookRunners(frameworkConf: ValidatedConfiguration, LogManager: LogManager, PluginInjector: MagnumDI): {
    runLoadHook: (composedPlugin: ComposedPlugin) => Promise<any>;
    runStartHook: (composedPlugin: ComposedPlugin) => Promise<any>;
    runStopHook: (composedPlugin: ComposedPlugin) => Promise<any>;
};
