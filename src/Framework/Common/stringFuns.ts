/**
 * @file StringFunctions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {includes, negate, curry} from 'lodash/fp'

export const reservedWords = [
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
  'yield' ]


const containsReserved = (word: string) => {
  return includes(word, reservedWords)
}

const validParameterRegXp = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/

export const validParameter = (p: string) => {
  return (negate(containsReserved)(p) && validParameterRegXp.test(p))
}

export const pluralizer = curry(({negative, zero, one, many}: {negative: string, zero: string, one: string, many: string }, count: number) => {
  return count < 0 ? negative : count > 1 ? many : count ? one : zero
})
