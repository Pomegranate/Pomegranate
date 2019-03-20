/**
 * @file PluginFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {reduce, toPairs} from 'lodash/fp'
import {PluginFileHandler} from "../FileHelpers";

export const PluginFilesFactory = (dirs:any) => {
  let arr = toPairs(dirs)

  let pluginDirs = reduce((obj, [key, path]) => {
    obj[key] = PluginFileHandler(path)
    return obj
  }, {}, arr)
  return function (prop: string) {
    let fileHandlers = pluginDirs[prop]
    if(fileHandlers){
      return fileHandlers
    }
    throw new Error(`Plugin Directory with property ${prop} does not exist.`)
  }
}