/**
 * @file ValidatePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {RuntimeFrameworkState, ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {buildPluginSkeletons} from "../buildPluginSkeletons";
import {MagnumDI} from "magnum-di";
import {reportCommonErrors} from "../Common/ErrorReporters";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";

export async function ValidatePlugins(PomConfig: RuntimeFrameworkState, LogManager: LogManager, PluginInjector: MagnumDI, loadedPlugins){
  rightBar(LogManager.use('system')).run({msg: 'Validating Plugins'})
  PomConfig.FrameworkMetrics.startFrameworkPhase('CreatePluginValidator')
  async function PluginValidator(rawModules){
    let createSkeletons = buildPluginSkeletons(PomConfig, LogManager, PluginInjector)
    let skeletons = await createSkeletons(rawModules)
    return skeletons
  }
  try {
    let validatedPlugins = await PluginValidator(loadedPlugins)
    LogManager.use('pomegranate').log(`Plugin validation took ${PomConfig.FrameworkMetrics.stopFrameworkPhase('CreatePluginValidator')}ms.`, 3)
    return validatedPlugins
  }
  catch(e){
    reportCommonErrors(e, LogManager.use('system'))
    throw new Error('Plugin Creation and validation failed.')
  }

}