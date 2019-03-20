"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const Dependency_1 = require("../Dependency");
const helpers_1 = require("../Plugin/helpers");
const FutureState_1 = require("../Common/FutureState");
const injectableParams = (pluginArray) => {
    return fp_1.filter(Boolean, fp_1.map((plugin) => {
        return helpers_1.getFqShortname(plugin) === plugin.configuration.injectableParam ? null : plugin.configuration.injectableParam;
    }, pluginArray));
};
exports.updateFrameworkMeta = (LogManager, frameworkMetrics, futureConf, skeletons) => {
    frameworkMetrics.startFrameworkPhase('RuntimeState');
    return futureConf
        .flatMap((currentState, collector) => {
        let c = fp_1.assign(collector, currentState);
        c.injectableParameters = injectableParams(skeletons);
        c.availablePlugins = fp_1.map(helpers_1.getFqShortname, skeletons);
        c.providingPlugins = Dependency_1.getProvidingPlugins(skeletons);
        c.allAvailable = fp_1.concat(c.injectableParameters, c.availablePlugins);
        return FutureState_1.FutureState(c);
    })
        .run({})
        .then((results) => {
        LogManager.use('pomegranate').log(`Runtime state creation took ${frameworkMetrics.stopFrameworkPhase('RuntimeState')}ms.`, 3);
        return results;
    });
};
//# sourceMappingURL=updateFrameworkMeta.js.map