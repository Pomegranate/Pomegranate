/**
 * @file fileBaseName
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
import {parse} from 'path'
import {upperFirst, toLower} from 'lodash/fp'

/**
 *
 * @module fileBaseName
 */

export const fileBaseName = (pathName, uppercase = false) => {
  let fbn = parse(pathName).name
  return uppercase ?  upperFirst(toLower(fbn)) : fbn
}