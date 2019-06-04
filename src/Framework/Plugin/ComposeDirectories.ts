import Bluebird from 'bluebird'
import {directoryBasePath, hasDirectories} from "./helpers";
import {isDirectory} from "../Configuration/helpers";

import {isPluginDirectory, PluginDirectory,} from "./index";
import {ComposedFrameworkState, RuntimeFrameworkState, ValidatedConfiguration} from "../Configuration";
import {joinPluginWorkBase, joinBasePath} from "../Configuration/helpers";
import {reduce} from 'lodash/fp'
import {ValidatedTransformer} from "../Validation";
/**
 * @file ComposeDirectories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


export const ComposeDirectories = (FrameworkConfiguration: ValidatedTransformer)=>{
  return (skeleton, collector) => { // Assemble plugin directory objects
    if (hasDirectories(skeleton)) {
      // Does the `./application/<ApplicationName>/<PluginName>/ dir exist?
      //@ts-ignore
      let workBasePath = joinBasePath(FrameworkConfiguration.getKey('buildDirs.applicationDirectory'), directoryBasePath(skeleton))
      //@ts-ignore
      let projectBasePath = joinBasePath(FrameworkConfiguration.getKey('projectDirs.applicationDirectory'), directoryBasePath(skeleton))
      let joinToWorkBase = joinBasePath(workBasePath)
      let joinToProjectBase = joinBasePath(projectBasePath)


      let runtimeDirs = reduce((acc, directory) => {
        if (isPluginDirectory(directory)) {
          acc['runtimeDirs'][directory.prop] = joinToWorkBase(directory.path)
          acc['projectDirs'][directory.prop] = joinToProjectBase(directory.path)
          return acc
        }
        acc['runtimeDirs'][directory] = joinToWorkBase(directory)
        acc['projectDirs'][directory] = joinToProjectBase(directory)

        return acc
      }, {runtimeDirs: {}, projectDirs: {}}, skeleton.state.directories)

      collector.runtimeDirectories = runtimeDirs.runtimeDirs
      collector.projectDirectories = runtimeDirs.projectDirs
      return collector
    }
    collector.runtimeDirectories = null
    return collector
  }
}
