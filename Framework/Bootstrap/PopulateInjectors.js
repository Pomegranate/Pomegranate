"use strict";
/**
 * @file PopulateInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const Timers_1 = require("../Plugin/Timers");
const PluginFiles_1 = require("../Plugin/PluginFiles");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
// import {getFqShortname, getFqParentname, getFqn} from "@pomegranate/plugin-tools";
const helpers_1 = require("../Plugin/helpers");
exports.PopulateInjectors = (LogManager, frameworkMetrics, GlobalInjector, FrameworkEvents, composed) => {
    frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Populating Plugin child injectors' });
    frameworkMetrics.startFrameworkPhase('PopulateInjectors');
    let results = fp_1.map((plugin) => {
        // let ParentName = getFqParentname(plugin)
        let PluginName = helpers_1.getFqShortname(plugin);
        let FQN = helpers_1.getFqn(plugin);
        plugin.logger.log('Populating Child injector.');
        let ChildInjector = GlobalInjector.createChain(FQN);
        ChildInjector.anything('PluginStore', {});
        ChildInjector.anything('PluginVariables', plugin.runtimeVariables);
        ChildInjector.anything('PluginLogger', plugin.logger);
        ChildInjector.anything('PluginTimer', Timers_1.PluginTimer(plugin.logger, plugin.timeout));
        ChildInjector.anything('PluginLateError', (error) => {
            plugin.logger.error('Encountered a late error.');
            plugin.logger.error(error);
            FrameworkEvents.emit('lateError', { name: PluginName });
        });
        if (plugin.runtimeDirectories) {
            plugin.logger.log(`Has directories, adding PluginFiles to the injector.`);
            ChildInjector.anything('PluginFiles', PluginFiles_1.PluginFilesFactory(plugin));
        }
        plugin.injector = ChildInjector;
        return plugin;
    }, composed);
    LogManager.use('pomegranate').log(`Populated child injectors in ${frameworkMetrics.stopFrameworkPhase('PopulateInjectors')}ms.`, 3);
    return results;
};
//# sourceMappingURL=PopulateInjectors.js.map