"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const helpers_1 = require("../Plugin/helpers");
const PluginFiles_1 = require("../Plugin/PluginFiles");
const plugin_tools_1 = require("@pomegranate/plugin-tools");
/**
 * @file PopulateCliInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
exports.PopulateCliInjectors = (GlobalInjector, composed) => {
    let results = fp_1.map((plugin) => {
        let PluginName = helpers_1.getFqShortname(plugin);
        plugin.logger.log('Populating Child injector.');
        let ChildInjector = GlobalInjector.createChain(plugin_tools_1.getFqn(plugin));
        ChildInjector.anything('PluginStore', {});
        ChildInjector.anything('PluginVariables', plugin.runtimeVariables);
        ChildInjector.anything('PluginLogger', plugin.logger);
        if (plugin.runtimeDirectories) {
            plugin.logger.log(`Has directories, adding PluginFiles to the injector.`);
            ChildInjector.anything('PluginFiles', PluginFiles_1.PluginFilesFactory(plugin));
        }
        plugin.injector = ChildInjector;
        return plugin;
    }, composed);
    return results;
};
//# sourceMappingURL=PopulateCliInjectors.js.map