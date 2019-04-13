import {RuntimeFrameworkState, ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {rightBar} from "../Common/frameworkOutputs";
import {RequirePlugins} from "../RequirePlugins";
import {IFutureState, FutureState} from "../Common/FutureState";
import {isDirectory, joinBasePath} from "../Configuration/helpers";

/**
 * @file CreateFrameworkState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const directoryExists = async (basePath,dirPath, msg) => {
  try {
    let dir = await isDirectory(basePath, dirPath)
    return dir
  }
  catch(err){
    throw new Error(`${msg} ${err.message}`)
  }

}


export async function CreateFrameworkState(frameworkLogger: PomegranateLogger, futureConf: IFutureState<ValidatedConfiguration>): Promise<IFutureState<RuntimeFrameworkState>> {
  return futureConf
    .map(async (skeleton, collector) => {
      let baseDir = skeleton.baseDirectory
      //@ts-ignore
      let buildDir = await directoryExists(baseDir, skeleton.buildDirectory, 'config.buildDirectory:')
      //@ts-ignore
      let projectDir = await directoryExists(baseDir, skeleton.projectDirectory, 'config.projectDirectory:')
      collector.baseDirectory = baseDir
      collector.projectDirectory = projectDir
      collector.buildDirectory = buildDir

      collector.projectApplicationDirectory = await directoryExists(projectDir, skeleton.applicationDirectory, 'config.applicationDirectory')
      collector.projectPluginDirectory = await directoryExists(projectDir, skeleton.pluginDirectory, 'config.pluginDirectory')
      collector.projectPluginConfigDirectory = await directoryExists(projectDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory')

      collector.applicationDirectory = await directoryExists(buildDir, skeleton.applicationDirectory, 'config.applicationDirectory')
      collector.pluginDirectory = await directoryExists(buildDir, skeleton.pluginDirectory, 'config.pluginDirectory')
      collector.pluginConfigDirectory = await directoryExists(buildDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory')
      collector.pluginNamespaces = skeleton.pluginNamespaces
      collector.logger = skeleton.logger
      collector.logLevel = skeleton.logLevel
      collector.colorOutput = skeleton.colorOutput
      collector.timeout = skeleton.timeout
      collector.pkgDependencies = skeleton.pkgDependencies
      collector.FrameworkMetrics = skeleton.FrameworkMetrics

      return collector
    })
    .run({})
    .then((result) => {
      return FutureState<RuntimeFrameworkState>(result)
    })

}