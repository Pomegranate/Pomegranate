/**
 * @file joinWithBase
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {curry} from 'lodash/fp'
import {join} from 'path'

export const joinWithBase = curry((baseDirectory, path) => {
    return join(baseDirectory, path)
})