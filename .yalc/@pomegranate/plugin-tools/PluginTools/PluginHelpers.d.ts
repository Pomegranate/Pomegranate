/**
 * @file helpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="lodash" />
export declare const getName: import("lodash/fp").LodashGet5x1;
export declare const getDirectories: import("lodash/fp").LodashGet5x1;
export declare const getParents: import("lodash/fp").LodashGet5x1;
export declare const getNamespace: import("lodash/fp").LodashGet5x1;
export declare const hasParents: (parents: any) => boolean;
export declare const getFqn: import("lodash/fp").LodashGet5x1;
export declare const fqDeclaredName: ((fqn: string[]) => string) & import("lodash").MemoizedFunction;
export declare const fqShortName: ((fqn: string[]) => string[]) & import("lodash").MemoizedFunction;
export declare const fqParentName: ((fqn: string[]) => string[]) & import("lodash").MemoizedFunction;
export declare const joinFqParentname: (a1: string[]) => string;
export declare const joinFqShortname: (a1: string[]) => string;
export declare const getFqParentname: (a1: any) => string;
export declare const getFqShortname: (a1: any) => string;
export declare const fqLineage: ((fqn: any) => {}[]) & import("lodash").MemoizedFunction;
export declare const hasDirectories: (plugin: any) => boolean;
export declare const directoryBasePath: (plugin: any) => string;
export declare const configObjectPath: import("lodash").CurriedFunction2<any, any, string>;
export declare const configPath: (plugin: any) => {}[];
export declare const getConfigFilePath: (plugin: any) => string;
