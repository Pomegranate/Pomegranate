/**
 * @file StringFunctions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/// <reference types="lodash" />
export declare const reservedWords: string[];
export declare const validParameter: (p: string) => boolean;
export declare const pluralizer: import("lodash").CurriedFunction2<{
    negative: string;
    zero: string;
    one: string;
    many: string;
}, number, string>;
