"use strict";
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
const lodash_fun_1 = require("lodash-fun");
const stringFuns_1 = require("../../Common/stringFuns");
const path_1 = require("path");
const Plugin_1 = require("../../Plugin");
const hasHookFuns = lodash_fun_1.hasKeysWith(['load', 'start', 'stop'], fp_1.isFunction);
const isCommand = fp_1.matchesProperty('configuration.type', 'command');
const isOverride = fp_1.matchesProperty('configuration.type', 'override');
const isInstaller = fp_1.matchesProperty('configuration.type', 'installer');
const isNullOrUndefined = v => (fp_1.isNull(v) || fp_1.isUndefined(v));
const defaultArrayFromNull = (mayBeArr, errmsg) => {
    return fp_1.isNull(mayBeArr) ? [] : fp_1.isArray(mayBeArr) ? fp_1.compact(mayBeArr) : new Error(errmsg);
};
const getNamespace = (srcConfig) => {
    let ns = fp_1.getOr(false, 'namespace', srcConfig);
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
    return [...getNamespace(srcConfig), ...srcConfig.parents];
}
const getConfigMeta = fp_1.memoize((srcPlugin) => {
    let loadSource = fp_1.getOr('unknown', 'loadSrc', srcPlugin);
    let moduleName = fp_1.getOr('Name missing', 'moduleSrc', srcPlugin);
    let pluginName = fp_1.getOr(moduleName, 'configuration.name', srcPlugin);
    let pluginType = fp_1.getOr('unknown', 'configuration.type', srcPlugin);
    return { loadSource, moduleName, pluginName, pluginType };
});
exports.pluginConfigValidators = (FrameworkState, GlobalInjector) => {
    return {
        variables: (variables, srcPlugin) => __awaiter(this, void 0, void 0, function* () {
            // Optional Plugin Parameter.
            if (isNullOrUndefined(variables)) {
                return {};
            }
            let valid = fp_1.isPlainObject(variables);
            let { loadSource, moduleName, pluginName } = getConfigMeta(srcPlugin);
            let errMsg = `${loadSource} Plugin ${pluginName} variables should be a plain object.`;
            return valid ? variables : new Error(errMsg);
        }),
        overrides: (overrides, srcPlugin) => {
            let { loadSource, moduleName, pluginName } = getConfigMeta(srcPlugin);
            let errMsg = `${loadSource} Plugin ${pluginName} contains an 'overrides' property but is not an override type plugin.`;
            return isOverride(srcPlugin) ? overrides : fp_1.has('overrides', srcPlugin) ? new Error(errMsg) : null;
        },
        installs: (installs, srcPlugin) => {
            return installs;
        },
        directories: (directories, srcPlugin) => {
            if (isNullOrUndefined(directories)) {
                return [];
            }
            let allStringPaths = fp_1.every((p) => {
                return fp_1.isString(p) || Plugin_1.isPluginDirectory(p);
            }, directories);
            return allStringPaths ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"');
            return directories;
        },
        configuration: {
            fqn: (_, srcPlugin) => {
                let fqn = srcPlugin.namespace ? [srcPlugin.namespace] : [];
                return [...fqn, ...srcPlugin.parents, srcPlugin.configuration.name];
            },
            name: (name, srcPlugin) => {
                let { loadSource, moduleName, pluginName } = getConfigMeta(srcPlugin);
                let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.name`;
                return fp_1.isString(name) ? [...fqn(srcPlugin), name] : new Error(errMsg);
            },
            type: (type, srcPlugin) => {
                let { loadSource, moduleName, pluginName } = getConfigMeta(srcPlugin);
                let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.type`;
                if (type === 'application') {
                    return srcPlugin.applicationPlugins ? type : new Error('Application type plugins must include plugin.applicationPlugins array.');
                }
                return (fp_1.includes(type, Plugin_1.pluginTypes)) ? type : new Error(errMsg);
            },
            injectableParam: (injectableParam, srcPlugin) => {
                let { loadSource, moduleName, pluginName, pluginType } = getConfigMeta(srcPlugin);
                let errMsg = `${loadSource} Plugin ${pluginName} config.injectableParam ${injectableParam} is not a valid ES5 parameter.`;
                if (requiresInjectableParam(srcPlugin)) {
                    if (isNullOrUndefined(injectableParam)) {
                        return new Error(`${loadSource} Plugin "${pluginName}" of type "${pluginType}" requires "config.injectableParam" to be set.`);
                    }
                    return validateInjectableParam(injectableParam, errMsg);
                }
                return injectableParam;
            },
            injectableScope: (injectableScope, srcPlugin) => {
                let scope = !injectableScope ?
                    'global' :
                    hasValidInjectableScope(injectableScope) ?
                        injectableScope :
                        new Error('config.injectableScope must be either "global", "namespace", or "application"');
                return scope;
            },
            applicationMember: (applicationMember) => {
                return fp_1.isArray(applicationMember) ? applicationMember : [];
            },
            frameworkPlugin: (frameworkPlugin) => {
                return frameworkPlugin;
            },
            depends: (depends) => defaultArrayFromNull(depends, 'configuration.depends must be string[]'),
            provides: (provides) => defaultArrayFromNull(provides, 'configuration.provides must be string[]'),
            optional: (optional) => defaultArrayFromNull(optional, 'configuration.optional must be string[]'),
        },
        hooks: {
            load: (hook, srcPlugin) => {
                return fp_1.isFunction(hook) ? hook : isCommand(srcPlugin) ? () => { } : new Error(`Load Hook must be a function.`);
            },
            start: (hook, srcPlugin) => {
                return fp_1.isFunction(hook) ? hook : isOverride(srcPlugin) ? null : () => { };
            },
            stop: (hook, srcPlugin) => {
                return fp_1.isFunction(hook) ? hook : isOverride(srcPlugin) ? null : () => { };
            }
        },
        commands: (commands) => {
            return fp_1.isFunction(commands) ? commands : null;
        },
        namespace: fp_1.identity,
        loadSrc: fp_1.identity,
        moduleSrc: fp_1.identity,
        parents: fp_1.identity,
        application: (application, src) => {
            return application ? true : false;
        },
        baseDirectory: _ => path_1.normalize(FrameworkState.baseDirectory),
        projectDirectory: _ => path_1.normalize(FrameworkState.projectDirectory),
        buildDirectory: _ => path_1.normalize(FrameworkState.buildDirectory),
    };
};
//# sourceMappingURL=pluginConfigValidator.js.map