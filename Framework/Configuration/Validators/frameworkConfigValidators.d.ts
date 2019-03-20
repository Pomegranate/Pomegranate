/**
 * @file frameworkConfigValidators
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare const frameworkConfigValidators: (basePath: any) => {
    buildDirectory: (dirPath: any) => string | Error;
    projectDirectory: (dirPath: any) => Promise<string | Error>;
    applicationDirectory: (dirPath: any) => Promise<string | Error>;
    pluginDirectory: (dirPath: any) => Promise<string | Error>;
    pluginConfigDirectory: (dirPath: any) => Promise<string | Error>;
    pluginNamespaces: (nsarr: string[]) => string[] | Error;
    logger: (logger: any) => any;
    logLevel: (level: any) => any;
    colorOutput: (color: boolean) => boolean;
    timeout: (timeout: number) => number | Error;
    baseDirectory: (baseDirectory: any) => string;
    pkgDependencies: (deps: any) => any;
};
