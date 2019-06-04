"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const Dependency_1 = require("../Dependency");
const helpers_1 = require("../Plugin/helpers");
const injectableParams = (pluginArray) => {
    return fp_1.filter(Boolean, fp_1.map((plugin) => {
        return helpers_1.getFqShortname(plugin) === plugin.state.configuration.injectableParam ? null : plugin.state.configuration.injectableParam;
    }, pluginArray));
};
exports.updateFrameworkMeta = (LogManager, FrameworkConfiguration, frameworkMetrics, skeletons) => {
    frameworkMetrics.startFrameworkPhase('RuntimeState');
    let injectableParameters = injectableParams(skeletons);
    let availablePlugins = fp_1.map(helpers_1.getFqShortname, skeletons);
    let providingPlugins = Dependency_1.getProvidingPlugins(skeletons);
    let allAvailable = fp_1.concat(injectableParameters, availablePlugins);
    FrameworkConfiguration.mergeValues({
        runtime: {
            injectableParameters,
            availablePlugins,
            providingPlugins,
            allAvailable
        }
    });
    LogManager.use('pomegranate').log(`Runtime state creation took ${frameworkMetrics.stopFrameworkPhase('RuntimeState')}ms.`, 3);
    return FrameworkConfiguration;
};
// export const updateFrameworkMeta = (LogManager: LogManager, frameworkMetrics, futureConf: any, skeletons: ValidatedPlugin[]): Promise<ComposedFrameworkState> => {
//   frameworkMetrics.startFrameworkPhase('RuntimeState')
//   return futureConf
//     .flatMap((currentState, collector) => {
//       let c = assign(collector, currentState)
//       c.injectableParameters = injectableParams(skeletons)
//       c.availablePlugins =  map(getFqShortname, skeletons)
//       c.providingPlugins = getProvidingPlugins(skeletons)
//       c.allAvailable = concat(c.injectableParameters, c.availablePlugins)
//       return FutureState(c)
//     })
//     .run({})
//     .then((results) => {
//       LogManager.use('pomegranate').log(`Runtime state creation took ${frameworkMetrics.stopFrameworkPhase('RuntimeState')}ms.`, 3)
//       return results
//     })
// }
//# sourceMappingURL=updateFrameworkMeta.js.map