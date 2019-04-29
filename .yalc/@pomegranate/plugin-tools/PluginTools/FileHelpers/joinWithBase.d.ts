/// <reference types="lodash" />
export declare const joinWithBase: import("lodash").CurriedFunction2<any, any, string>;
export declare const manualJoinWithBase: (baseDirectory: string) => (...paths: string[]) => string;
