"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const PluginFiles_1 = require("../Plugin/PluginFiles");
const plugin_tools_1 = require("@pomegranate/plugin-tools");
/**
 * @file PopulateCliInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
exports.PopulateCliInjectors = (GlobalInjector, composed) => {
    let PluginFileHelpers = PluginFiles_1.createPluginFilesObj(composed);
    let PickDirs = PluginFiles_1.pickDirectory(PluginFileHelpers);
    GlobalInjector.anything('PluginDirectories', PluginFileHelpers);
    GlobalInjector.anything('PluginPickDirectory', PickDirs);
    let results = fp_1.map((plugin) => {
        let PluginName = plugin_tools_1.getFqShortname(plugin);
        let FQN = plugin_tools_1.getFqn(plugin);
        plugin.logger.log('Populating Child injector.');
        let ChildInjector = GlobalInjector.createChain(FQN);
        ChildInjector.anything('PluginStore', {});
        ChildInjector.anything('PluginVariables', plugin.runtimeVariables);
        ChildInjector.anything('PluginLogger', plugin.logger);
        if (fp_1.has(PluginName, PluginFileHelpers)) {
            plugin.logger.log(`Has directories, adding PluginFiles to the injector.`);
            ChildInjector.anything('PluginFiles', fp_1.get(PluginName, PluginFileHelpers));
        }
        // if(plugin.runtimeDirectories){
        //   plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
        //   ChildInjector.anything('PluginFiles', PluginFilesFactory(plugin))
        // }
        plugin.injector = ChildInjector;
        return plugin;
    }, composed);
    return results;
};
//# sourceMappingURL=PopulateCliInjectors.js.map