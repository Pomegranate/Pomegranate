/**
 * @file helpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="lodash" />
export declare function joinBasePath(basePath: string, path?: string): any;
export declare const settingPath: (fullPath: any, confProp: any) => import("lodash").Dictionary<any>;
export declare function joinPluginWorkBase(basepath: string, workBase: string): any;
export declare function directoryExists(path: any): Promise<any>;
export declare function isDirectory(basePath: any, dir: any): Promise<any>;
export declare function requireFile(basePath: any, filePath: any): Promise<any>;
export declare function filterIndexedDirs(pluginDirPath: string, files: string[]): Promise<string[]>;
