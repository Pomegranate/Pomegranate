import {MagnumDI} from "magnum-di";
import {ComposedPlugin} from "../Plugin";
import {compose, filter, map, fromPairs, has, get} from "lodash/fp";
import {pickDirectory, createPluginFilesObj} from "../Plugin/PluginFiles";

import {getFqShortname, getFqParentname, getFqn} from "@pomegranate/plugin-tools"

/**
 * @file PopulateCliInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


export const PopulateCliInjectors = (GlobalInjector: MagnumDI, composed: ComposedPlugin[]) => {

  let PluginFileHelpers = createPluginFilesObj(composed)
  let PickDirs = pickDirectory(PluginFileHelpers)

  GlobalInjector.anything('PluginDirectories', PluginFileHelpers)
  GlobalInjector.anything('PluginPickDirectory', PickDirs)


  let results = map((plugin) => {
    let PluginName = getFqShortname(plugin)
    let FQN = getFqn(plugin)
    plugin.logger.log('Populating Child injector.')
    let ChildInjector = GlobalInjector.createChain(FQN)
    ChildInjector.anything('PluginStore', {})
    ChildInjector.anything('PluginVariables', plugin.runtimeVariables)
    ChildInjector.anything('PluginLogger', plugin.logger)

    if(has(PluginName, PluginFileHelpers)){
      plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
      ChildInjector.anything('PluginFiles', get(PluginName, PluginFileHelpers))
    }
    // if(plugin.runtimeDirectories){
    //   plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
    //   ChildInjector.anything('PluginFiles', PluginFilesFactory(plugin))
    // }
    plugin.injector = ChildInjector
    return plugin

  }, composed)


  return results

}