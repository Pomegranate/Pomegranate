/**
 * @file FrameworkConfig
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare const transformer: (basePath: any) => {
    buildDirectory: import("lodash/fp").LodashIdentity;
    projectDirectory: import("lodash/fp").LodashIdentity;
    applicationDirectory: import("lodash/fp").LodashIdentity;
    pluginDirectory: import("lodash/fp").LodashIdentity;
    pluginConfigDirectory: import("lodash/fp").LodashIdentity;
    baseDirectory: (val: any) => string;
    projectDirs: {
        base: (val: any, src: any) => Promise<string>;
        applicationDirectory: (val: any, src: any) => Promise<string>;
        pluginDirectory: (val: any, src: any) => Promise<string>;
        pluginConfigDirectory: (val: any, src: any) => Promise<string>;
    };
    buildDirs: {
        base: (val: any, src: any) => Promise<string>;
        applicationDirectory: (val: any, src: any) => Promise<string>;
        pluginDirectory: (val: any, src: any) => Promise<string>;
        pluginConfigDirectory: (val: any, src: any) => Promise<string>;
    };
    pluginNamespaces: import("lodash/fp").LodashIdentity;
    logger: import("lodash/fp").LodashIdentity;
    logLevel: import("lodash/fp").LodashIdentity;
    colorOutput: import("lodash/fp").LodashIdentity;
    timeout: import("lodash/fp").LodashIdentity;
    pkgDependencies: (val: any) => any;
};
export declare const conformer: {
    buildDirectory: (val: any) => string | Error;
    projectDirectory: (val: any) => Promise<string | Error>;
    applicationDirectory: (val: any) => Promise<string | Error>;
    pluginDirectory: (val: any) => Promise<string | Error>;
    pluginConfigDirectory: (val: any) => Promise<string | Error>;
    baseDirectory: (val: any) => any;
    projectDirs: {
        base: (val: any, src: any) => Promise<any>;
        applicationDirectory: (val: any, src: any) => Promise<any>;
        pluginDirectory: (val: any, src: any) => Promise<any>;
        pluginConfigDirectory: (val: any, src: any) => Promise<any>;
    };
    buildDirs: {
        base: (val: any, src: any) => Promise<any>;
        applicationDirectory: (val: any, src: any) => Promise<any>;
        pluginDirectory: (val: any, src: any) => Promise<any>;
        pluginConfigDirectory: (val: any, src: any) => Promise<any>;
    };
    pluginNamespaces: (val: string[]) => string[] | Error;
    logger: (val: any) => any;
    logLevel: (val: any) => any;
    colorOutput: (val: boolean) => boolean;
    timeout: (val: number) => number | Error;
    pkgDependencies: (val: any) => any;
};
