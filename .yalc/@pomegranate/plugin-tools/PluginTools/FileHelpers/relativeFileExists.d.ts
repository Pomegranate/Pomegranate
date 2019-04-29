/// <reference types="lodash" />
export declare const relativeFileExists: import("lodash").CurriedFunction2<any, any, Promise<boolean>>;
export declare const manualRelativeFileExists: (basepath: string) => (...paths: string[]) => Promise<boolean>;
