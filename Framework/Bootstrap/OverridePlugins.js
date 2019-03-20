"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const helpers_1 = require("../Plugin/helpers");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
function onlyOverridePlugins(plugins) {
    return fp_1.filter((plugin) => {
        return plugin.configuration.type === 'override';
    }, plugins);
}
function onlyRuntimePlugins(plugins) {
    return fp_1.filter((plugin) => {
        let type = plugin.configuration.type;
        return (type !== 'override');
    }, plugins);
}
exports.OverridePlugins = (LogManager, frameworkMetrics, composed) => {
    frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Overriding plugins' });
    frameworkMetrics.startFrameworkPhase('OverridePlugins');
    let overridePlugins = onlyOverridePlugins(composed);
    let runtimePlugins = onlyRuntimePlugins(composed);
    /**
     * TODO - Can probably find the intersection here between override plugins and save some loops.
     * @author - Jim Bulkowski
     * @date - 2019-02-14
     * @time - 12:46
     */
    let overriddenPlugins = fp_1.map((plugin) => {
        let fqn = helpers_1.getFqShortname(plugin);
        let toOvr = fp_1.find((p) => {
            return p.overrides === fqn;
        }, overridePlugins);
        if (toOvr) {
            let onlyHooks = fp_1.pickBy(fp_1.negate(fp_1.isNull), toOvr.hooks);
            let hKys = fp_1.keys(onlyHooks);
            plugin.logger.warn(`${hKys.length > 1 ? 'Hooks' : 'Hook'} - ${fp_1.keys(onlyHooks).join(', ')} - being overridden by ${helpers_1.getFqShortname(toOvr)}`, 1);
            plugin.hooks = fp_1.merge(plugin.hooks, onlyHooks);
            plugin.runtimeVariables = fp_1.merge(plugin.runtimeVariables, toOvr.runtimeVariables);
            plugin.runtimeDirectories = fp_1.merge(plugin.runtimeDirectories, toOvr.runtimeDirectories);
            plugin.configuration.depends = fp_1.concat(plugin.configuration.depends, toOvr.configuration.depends);
            plugin.configuration.provides = fp_1.concat(plugin.configuration.provides, toOvr.configuration.provides);
            plugin.configuration.optional = fp_1.concat(plugin.configuration.optional, toOvr.configuration.optional);
            return plugin;
        }
        return plugin;
    }, runtimePlugins);
    LogManager.use('pomegranate').log(`Plugin overrides took ${frameworkMetrics.stopFrameworkPhase('OverridePlugins')}ms.`, 3);
    return overriddenPlugins;
};
//# sourceMappingURL=OverridePlugins.js.map