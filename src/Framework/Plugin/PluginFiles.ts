/**
 * @file PluginFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {compose, filter, fromPairs, map, reduce, toPairs, get, isFunction} from 'lodash/fp'
// import {PluginFileHandler} from "../FileHelpers";
import {getFqShortname, PluginFileHandler} from "@pomegranate/plugin-tools";
import {ComposedPlugin} from "./index";

export const PluginFilesFactory = (plugin:any) => {
  let runtimeDirs = plugin.runtimeDirectories
  let projectDirs = plugin.projectDirectories
  let runtimePaths = toPairs(runtimeDirs)

  let paths = map(([key, path]: [string, string]) => {
    return [key, {runtimeDir: path, projectDir: projectDirs[key]}]
  }, runtimePaths)

  let pluginDirs = reduce((obj, [key, {runtimeDir, projectDir}]: [string, {runtimeDir: string, projectDir: string}]) => {
    obj[key] = PluginFileHandler(runtimeDir, projectDir)
    return obj
  }, {}, paths)

  return function (prop: string) {
    let fileHandlers = pluginDirs[prop]
    if(fileHandlers){
      return fileHandlers
    }
    throw new Error(`Plugin Directory with property ${prop} does not exist.`)
  }
}

export const createPluginFilesObj = compose(fromPairs, map((p: ComposedPlugin) => [getFqShortname(p), PluginFilesFactory(p)]), filter((p: ComposedPlugin) => p.runtimeDirectories))

export const pickDirectory = pluginDirObj => (pluginName, dirProp) => {
  let pluginFiles = get(pluginName, pluginDirObj)
  if(isFunction(pluginFiles)){
    return pluginFiles(dirProp)
  }
  throw new Error(`No Plugin directories found for ${pluginName}`)
}