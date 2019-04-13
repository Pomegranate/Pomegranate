import {MagnumDI} from "magnum-di";
import {EventEmitter} from "events";
import {ComposedPlugin} from "../Plugin";
import {rightBar} from "../Common/frameworkOutputs";
import {map} from "lodash/fp";
import {getFqShortname} from "../Plugin/helpers";
import {PluginTimer} from "../Plugin/Timers";
import {PluginFilesFactory} from "../Plugin/PluginFiles";
import {getFqn} from "@pomegranate/plugin-tools";

/**
 * @file PopulateCliInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const PopulateCliInjectors = (GlobalInjector: MagnumDI, composed: ComposedPlugin[]) => {

  let results = map((plugin) => {
    let PluginName = getFqShortname(plugin)
    plugin.logger.log('Populating Child injector.')
    let ChildInjector = GlobalInjector.createChain(getFqn(plugin))
    ChildInjector.anything('PluginStore', {})
    ChildInjector.anything('PluginVariables', plugin.runtimeVariables)
    ChildInjector.anything('PluginLogger', plugin.logger)

    if(plugin.runtimeDirectories){
      plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
      ChildInjector.anything('PluginFiles', PluginFilesFactory(plugin))
    }
    plugin.injector = ChildInjector
    return plugin

  }, composed)


  return results

}