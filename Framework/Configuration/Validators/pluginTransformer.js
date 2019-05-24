"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const lodash_fun_1 = require("lodash-fun");
const stringFuns_1 = require("../../Common/stringFuns");
const path_1 = require("path");
const hasHookFuns = lodash_fun_1.hasKeysWith(['load', 'start', 'stop'], fp_1.isFunction);
const isCommand = fp_1.matchesProperty('configuration.type', 'command');
const isOverride = fp_1.matchesProperty('configuration.type', 'override');
const isInstaller = fp_1.matchesProperty('configuration.type', 'installer');
const isNullOrUndefined = v => (fp_1.isNull(v) || fp_1.isUndefined(v));
const defaultArrayFromNull = (mayBeArr, errmsg) => {
    return fp_1.isNull(mayBeArr) ? [] : fp_1.isArray(mayBeArr) ? fp_1.compact(mayBeArr) : new Error(errmsg);
};
const getNamespace = (srcConfig) => {
    let ns = fp_1.getOr(false, 'loadMetadata.namespace', srcConfig);
    return ns ? [ns] : [];
};
const mustHaveInjectable = ['anything', 'factory', 'instance', 'merge'];
const requiresInjectableParam = (srcPlugin) => {
    return fp_1.includes(srcPlugin.configuration.type, mustHaveInjectable);
};
const mustHaveInjectableScope = ['global', 'namespace', 'application'];
const hasValidInjectableScope = (injectableScope) => {
    return fp_1.includes(injectableScope, mustHaveInjectableScope);
};
const validateInjectableParam = (injectableParam, errMsg) => {
    return stringFuns_1.validParameter(injectableParam) ? injectableParam : new Error(errMsg);
};
function fqn(srcConfig) {
    return [...getNamespace(srcConfig), ...srcConfig.loadMetadata.parents];
}
const getConfigMeta = fp_1.memoize((srcPlugin) => {
    let loadSource = fp_1.getOr('unknown', 'loadSrc', srcPlugin);
    let moduleName = fp_1.getOr('Name missing', 'moduleSrc', srcPlugin);
    let pluginName = fp_1.getOr(moduleName, 'configuration.name', srcPlugin);
    let pluginType = fp_1.getOr('unknown', 'configuration.type', srcPlugin);
    return { loadSource, moduleName, pluginName, pluginType };
});
exports.transformer = (FrameworkState, GlobalInjector) => {
    return {
        fqn: (_, src) => {
            let ns = fp_1.get('loadMetadata.namespace', src);
            let parents = fp_1.get('loadMetadata.parents', src);
            let name = fp_1.get('state.configuration.name', src);
            let fqn = ns ? [ns] : [];
            return [...fqn, ...parents, name];
        },
        name: (_, src) => {
            let name = fp_1.get('state.configuration.name', src);
            return fp_1.isString(name) ? [...fqn(src), name] : [];
        },
        baseDirectory: _ => path_1.normalize(FrameworkState.baseDirectory),
        projectDirectory: _ => path_1.normalize(FrameworkState.projectDirectory),
        buildDirectory: _ => path_1.normalize(FrameworkState.buildDirectory),
    };
};
// fqn: (_, srcPlugin) => {
//   let fqn = srcPlugin.namespace ? [srcPlugin.namespace] : []
//   return [...fqn, ...srcPlugin.parents, srcPlugin.configuration.name]
// },
//   name: (name, srcPlugin) => {
//   let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
//   let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.name`
//   return isString(name) ? [...fqn(srcPlugin), name] : new Error(errMsg)
// },
//# sourceMappingURL=pluginTransformer.js.map