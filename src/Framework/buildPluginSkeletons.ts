/**
 * @file buildPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {ValidatedConfiguration, pluginConfig, RuntimeFrameworkState} from "./Configuration";
import {PomegranateLogger} from './FrameworkLogger';
import {transformPlugin} from "./Configuration";
import {get} from "lodash/fp";
import Bluebird from "bluebird";

// import {PomegranatePlugin} from "./Plugin";
import {PomegranatePlugin} from "@pomegranate/plugin-tools"
import {MagnumDI} from "magnum-di";
import {LogManager} from "./FrameworkLogger/LogManager";

export const buildCLIPluginSkeletons = (FrameworkState: RuntimeFrameworkState, PluginInjector: MagnumDI) => {
  let applicationDirectory = get('applicationDirectory', FrameworkState)

  let SkeletonValidator = pluginConfig(FrameworkState, PluginInjector)
  return async function (skeletons: PomegranatePlugin[]) {
    return Bluebird.map(skeletons, (p) => {
      return SkeletonValidator(p)
    })
  }

}

export const buildPluginSkeletons = (FrameworkState: RuntimeFrameworkState, LogManager: LogManager, GlobalInjector: MagnumDI) => {
  let applicationDirectory = get('applicationDirectory', FrameworkState)

  // let SkeletonValidator = pluginConfig(FrameworkState, GlobalInjector)
  let SkeletonValidator = transformPlugin(FrameworkState, GlobalInjector)
  return async function (skeletons: any[]) {
    return Bluebird.map(skeletons, async (p) => {
      p.computedMetadata = await SkeletonValidator(p)

      return p
      // return SkeletonValidator(p)
    })
      .then((result) => {
        LogManager.use('pomegranate').log(`${result.length} Plugins valid`, 2)
        return result
      })
  }

}