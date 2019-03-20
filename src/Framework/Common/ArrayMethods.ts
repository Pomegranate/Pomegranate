/**
 * @file ArrayMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {curry} from 'lodash/fp'

export const append = curry((arr: any[], items)=> [...arr, ...items])