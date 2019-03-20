/**
 * @file JoinMockPath
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {curry} from 'lodash/fp'
import {normalize, join} from "path";

export const joinMockPath = curry((basePath, path) => {
  return normalize(join(basePath, path))
})