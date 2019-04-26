/**
 * @file SharedValidators
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="lodash" />
export declare const getConfigMeta: ((srcPlugin: any) => {
    loadSource: any;
    moduleName: any;
    pluginName: any;
    pluginType: any;
}) & import("lodash").MemoizedFunction;
export declare const variables: (variables: any, srcPlugin: any) => Promise<any>;
export declare const directories: (directories: any, srcPlugin: any) => any;
export declare const configName: (name: any, srcPlugin: any) => string | void;
export declare const configType: (type: any, srcPlugin: any) => any;
export declare const configInjectableParam: (injectableParam: any, srcPlugin: any) => any;
export declare const configInjectableScope: (injectableScope: any) => any;
export declare const configFrameworkPlugin: (frameworkPlugin: any) => boolean | Error;
export declare const configInjectorDeps: (prop: "optional" | "depends" | "provides") => (depends: any) => any[] | Error;
export declare const hooksRequired: (prop: "load") => (loadHook: any) => Error | ((...args: any[]) => any);
export declare const hooksOptional: (prop: "start" | "stop") => (optionalHook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
export declare const commands: (commands: any) => (...args: any[]) => any;
