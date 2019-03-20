import { RuntimeFrameworkState } from "../index";
import { MagnumDI } from "magnum-di";
export declare const pluginConfigValidators: (FrameworkState: RuntimeFrameworkState, PluginInjector: MagnumDI) => {
    variables: (variables: any, srcPlugin: any) => Promise<any>;
    overrides: (overrides: any, srcPlugin: any) => any;
    installs: (installs: any, srcPlugin: any) => any;
    directories: (directories: any, srcPlugin: any) => any;
    configuration: {
        fqn: (_: any, srcPlugin: any) => any[];
        name: (name: any, srcPlugin: any) => any[] | Error;
        type: (type: any, srcPlugin: any) => any;
        injectableParam: (injectableParam: any, srcPlugin: any) => any;
        frameworkPlugin: (frameworkPlugin: any) => any;
        depends: (depends: any) => any[] | Error;
        provides: (provides: any) => any[] | Error;
        optional: (optional: any) => any[] | Error;
    };
    hooks: {
        load: (hook: any) => Error | ((...args: any[]) => any);
        start: (hook: any, srcPlugin: any) => (...args: any[]) => any;
        stop: (hook: any, srcPlugin: any) => (...args: any[]) => any;
    };
    commands: (commands: any) => (...args: any[]) => any;
    namespace: import("lodash/fp").LodashIdentity;
    loadSrc: import("lodash/fp").LodashIdentity;
    moduleSrc: import("lodash/fp").LodashIdentity;
    parents: import("lodash/fp").LodashIdentity;
    baseDirectory: (_: any) => string;
    projectDirectory: (_: any) => string;
    buildDirectory: (_: any) => string;
};
