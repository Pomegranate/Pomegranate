"use strict";
/**
 * @file SharedValidators
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const stringFuns_1 = require("../Common/stringFuns");
/**
 * TODO - Move pluginTypes to Plugin-tools
 * @author - Jim Bulkowski
 * @date - 2019-04-16
 * @time - 08:19
 */
const Plugin_1 = require("../Plugin");
exports.getConfigMeta = fp_1.memoize((srcPlugin) => {
    let loadSource = fp_1.getOr('unknown', 'loadSrc', srcPlugin);
    let moduleName = fp_1.getOr('Name missing', 'moduleSrc', srcPlugin);
    let pluginName = fp_1.getOr(moduleName, 'configuration.name', srcPlugin);
    let pluginType = fp_1.getOr('unknown', 'configuration.type', srcPlugin);
    return { loadSource, moduleName, pluginName, pluginType };
});
const defaultArrayFromNull = (mayBeArr, errmsg) => {
    return fp_1.isNull(mayBeArr) ? [] : fp_1.isArray(mayBeArr) ? fp_1.compact(mayBeArr) : new Error(errmsg);
};
const isNullOrUndefined = v => (fp_1.isNull(v) || fp_1.isUndefined(v));
const validDirectoryProp = fp_1.every((p) => {
    return fp_1.isString(p) || Plugin_1.isPluginDirectory(p);
});
const validateInjectableParam = (injectableParam, errMsg) => {
    return stringFuns_1.validParameter(injectableParam) ? injectableParam : new Error(errMsg);
};
/**
 * TODO - Move injectableScopes to Plugin-tools
 * @author - Jim Bulkowski
 * @date - 2019-04-16
 * @time - 08:19
 */
const mustHaveInjectableScope = ['global', 'namespace', 'application'];
const hasValidInjectableScope = (injectableScope) => {
    return fp_1.includes(injectableScope, mustHaveInjectableScope);
};
exports.variables = (variables, srcPlugin) => __awaiter(this, void 0, void 0, function* () {
    // Optional Plugin Parameter.
    if (isNullOrUndefined(variables)) {
        return {};
    }
    let valid = fp_1.isPlainObject(variables);
    let { loadSource, moduleName, pluginName } = exports.getConfigMeta(srcPlugin);
    let errMsg = `${loadSource} Plugin ${pluginName} variables should be a plain object.`;
    return valid ? variables : new Error(errMsg);
});
exports.directories = (directories, srcPlugin) => {
    return isNullOrUndefined(directories) ? [] : validDirectoryProp(directories) ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"');
};
exports.configName = (name, srcPlugin) => {
    return fp_1.isString(name) ? name : (_ => {
        let { loadSource, moduleName, pluginName } = exports.getConfigMeta(srcPlugin);
        new Error(`${loadSource} Plugin ${pluginName} is missing configuration.name`);
    })();
};
exports.configType = (type, srcPlugin) => {
    let { loadSource, moduleName, pluginName } = exports.getConfigMeta(srcPlugin);
    let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.type`;
    return (fp_1.includes(type, Plugin_1.pluginTypes)) ? type : (_ => {
        let { loadSource, moduleName, pluginName } = exports.getConfigMeta(srcPlugin);
        new Error(`${loadSource} Plugin ${pluginName} is missing configuration.type`);
    })();
};
exports.configInjectableParam = (injectableParam, srcPlugin) => {
    let { loadSource, moduleName, pluginName, pluginType } = exports.getConfigMeta(srcPlugin);
    let errMsg = `${loadSource} Plugin ${pluginName} config.injectableParam ${injectableParam} is not a valid ES5 parameter.`;
    if (isNullOrUndefined(injectableParam)) {
        return new Error(`${loadSource} Plugin "${pluginName}" of type "${pluginType}" requires "config.injectableParam" to be set.`);
    }
    return validateInjectableParam(injectableParam, errMsg);
};
exports.configInjectableScope = (injectableScope) => {
    let scope = !injectableScope ?
        'global' :
        hasValidInjectableScope(injectableScope) ?
            injectableScope :
            new Error('config.injectableScope must be either "global", "namespace", or "application"');
    return scope;
};
exports.configFrameworkPlugin = (frameworkPlugin) => {
    return isNullOrUndefined(frameworkPlugin) ? false :
        fp_1.isBoolean(frameworkPlugin) ? frameworkPlugin : new Error('configuration.frameworkPlugin must be a boolean.');
};
exports.configInjectorDeps = (prop) => depends => defaultArrayFromNull(depends, `configuration.${prop} must be string[]`);
exports.hooksRequired = (prop) => (loadHook) => fp_1.isFunction(loadHook) ? loadHook : new Error(`${fp_1.toUpper(prop)} Hook must be a function.`);
exports.hooksOptional = (prop) => (optionalHook, srcPlugin) => fp_1.isFunction(optionalHook) ? optionalHook : isNullOrUndefined(optionalHook) ? () => {
} : new Error(`${fp_1.toUpper(prop)} Hook if defined, must be a function.`);
exports.commands = (commands) => {
    return fp_1.isFunction(commands) ? commands : null;
};
//# sourceMappingURL=SharedValidators.js.map