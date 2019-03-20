/**
 * @file relativeFileExists
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {curry} from 'lodash/fp'
import {pathExists} from 'fs-extra'
import {join} from 'path'
export const relativeFileExists = curry((basepath, filepath)=>{
  return pathExists(join(basepath, filepath))
})