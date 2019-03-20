/**
 * @file buildPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {ValidatedConfiguration, pluginConfig, RuntimeFrameworkState} from "./Configuration";
import {PomegranateLogger} from './FrameworkLogger';
import {get} from "lodash/fp";
import Bluebird from "bluebird";

// import {PomegranatePlugin} from "./Plugin";
import {PomegranatePlugin} from "@pomegranate/plugin-tools"
import {MagnumDI} from "magnum-di";
import {LogManager} from "./FrameworkLogger/LogManager";


export const buildPluginSkeletons = (FrameworkState: RuntimeFrameworkState, LogManager: LogManager, PluginInjector: MagnumDI) => {
  let applicationDirectory = get('applicationDirectory', FrameworkState)

  let SkeletonValidator = pluginConfig(FrameworkState, PluginInjector)
  return async function (skeletons: PomegranatePlugin[]) {
    return Bluebird.map(skeletons, (p) => {
      return SkeletonValidator(p)
    })
      .then((result) => {
        LogManager.use('pomegranate').log(`${result.length} Plugins valid`, 2)
        return result
      })
  }

}