"use strict";
/**
 * @file StringFunctions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
exports.reservedWords = [
    'abstract',
    'async',
    'boolean',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'double',
    'else',
    'enum',
    'export',
    'extends',
    'final',
    'finally',
    'float',
    'for',
    'function',
    'goto',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'int',
    'interface',
    'let',
    'long',
    'native',
    'new',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'super',
    'switch',
    'synchronized',
    'this',
    'throw',
    'throws',
    'transient',
    'try',
    'typeof',
    'var',
    'void',
    'volatile',
    'while',
    'with',
    'yield'
];
const containsReserved = (word) => {
    return fp_1.includes(word, exports.reservedWords);
};
const validParameterRegXp = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
exports.validParameter = (p) => {
    return (fp_1.negate(containsReserved)(p) && validParameterRegXp.test(p));
};
//# sourceMappingURL=stringFuns.js.map