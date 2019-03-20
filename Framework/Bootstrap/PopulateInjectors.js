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
const helpers_1 = require("../Plugin/helpers");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
exports.PopulateInjectors = (LogManager, frameworkMetrics, PluginDI, FrameworkEvents, composed) => {
    frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Populating Plugin child injectors' });
    frameworkMetrics.startFrameworkPhase('PopulateInjectors');
    let results = fp_1.map((plugin) => {
        let PluginName = helpers_1.getFqShortname(plugin);
        plugin.logger.log('Populating Child injector.');
        let ChildInjector = PluginDI.createChild();
        ChildInjector.service('PluginStore', {});
        ChildInjector.service('PluginVariables', plugin.runtimeVariables);
        ChildInjector.service('PluginLogger', plugin.logger);
        ChildInjector.service('PluginTimer', Timers_1.PluginTimer(plugin.logger, plugin.timeout));
        ChildInjector.service('PluginLateError', (error) => {
            plugin.logger.error('Encountered a late error.');
            plugin.logger.error(error);
            FrameworkEvents.emit('lateError', { name: PluginName });
        });
        if (plugin.runtimeDirectories) {
            plugin.logger.log(`Has directories, adding PluginFiles to the injector.`);
            ChildInjector.service('PluginFiles', PluginFiles_1.PluginFilesFactory(plugin.runtimeDirectories));
        }
        plugin.injector = ChildInjector;
        return plugin;
    }, composed);
    LogManager.use('pomegranate').log(`Populated child injectors in ${frameworkMetrics.stopFrameworkPhase('PopulateInjectors')}ms.`, 3);
    return results;
};
//# sourceMappingURL=PopulateInjectors.js.map