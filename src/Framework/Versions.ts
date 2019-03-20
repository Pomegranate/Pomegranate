/**
 * @file Versions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MODULE_VERSIONS} from "./__MODULE_VERSIONS";
import {PomegranateLogger} from "./FrameworkLogger";
import {each} from 'lodash/fp'

export function Versions(frameworkLogger: PomegranateLogger) {

  each(([pkg, version]) => {
    frameworkLogger.log(`Using ${pkg} version ${version}`, 3)
  }, MODULE_VERSIONS)
}