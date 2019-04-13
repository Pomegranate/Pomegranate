"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file runHook
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_fun_1 = require("lodash-fun");
const buildInjectorChain = (plugin) => {
    let ns = fp_1.get('plugin.namespace', plugin);
    let parents = fp_1.get('plugin.parents', plugin);
    return ns ? [ns, ...parents] : parents;
};
const selectInjector = (GlobalInjector, plugin) => {
    let scope = fp_1.get('plugin.configuration.injectableScope', plugin);
    if (scope === 'global') {
        return GlobalInjector;
    }
    if (scope === 'namespace') {
        let ns = fp_1.get('plugin.namespace', plugin);
        return ns ? GlobalInjector.findChain([ns]) : GlobalInjector;
    }
    if (scope === 'application') {
        let chain = buildInjectorChain(plugin);
        let application = fp_1.get('plugin.application', plugin);
        return GlobalInjector.findChain(chain);
    }
    throw new Error(`Unable to compute and injection scope for this plugin, "config.injectableScope" must be global, namespace, or application
  If You are seeing this error something serious has gone wrong.`);
};
let computeCase = fp_1.get('type');
const typeFuns = {
    action: (v) => {
        return [];
    },
    anything: (v) => {
        return [injectable(v, 'anything')];
    },
    composite: (v) => {
        return composite(v);
    },
    factory: (v) => {
        return [injectable(v, 'factory')];
    },
    instance: (v) => {
        return [injectable(v, 'instance')];
    },
    merge: (v) => {
        return [injectable(v, 'merge')];
    },
    loghandler: (v) => {
        return [loghandler(v)];
    }
};
const handleInjectable = lodash_fun_1.switchWith(computeCase, typeFuns);
function newStructure(pluginData) {
    return handleInjectable(pluginData);
}
function structure(composedPlugin, result) {
    let type = fp_1.get('configuration.type', composedPlugin);
    return handleInjectable({ type, composedPlugin, result });
}
function composite(plugin, LogManager) {
    // console.log(plugin)
    let injectables = fp_1.get('hookResult', plugin);
    return fp_1.flattenDeep(fp_1.map((result) => {
        let type = fp_1.getOr('anything', 'type', result);
        let clonePlugin = fp_1.clone(plugin.plugin);
        let n = fp_1.set('configuration.type', type, clonePlugin);
        let o = fp_1.set('configuration.injectableParam', fp_1.get('injectableParam', result), n);
        let p = fp_1.set('configuration.injectableScope', fp_1.getOr('global', 'injectableScope', result), o);
        let newHandler = {
            type,
            plugin: p,
            hookResult: fp_1.get('load', result)
        };
        return handleInjectable(newHandler);
    }, injectables));
}
function injectable(plugin, type) {
    return (globalInjector, LogManager) => {
        let injectableParam = fp_1.get('plugin.configuration.injectableParam', plugin);
        let injectableValue = fp_1.get('hookResult', plugin);
        let scopedInjector = selectInjector(globalInjector, plugin);
        scopedInjector[type](injectableParam, injectableValue);
        return { type, injectableParam };
    };
}
function loghandler(plugin) {
    return (globalInjector, LogManager) => {
        let injectableValue = fp_1.get('hookResult', plugin);
        LogManager.addHandler(injectableValue);
        return null;
    };
}
function placeInjectables(composedPlugin, hookResult, pluginLogger, GlobalInjector, LogManager) {
    let type = fp_1.get('configuration.type', composedPlugin);
    let data = {
        type,
        plugin: {
            configuration: fp_1.get('configuration', composedPlugin),
            parents: fp_1.get('parents', composedPlugin),
            namespace: fp_1.get('namespace', composedPlugin),
            application: fp_1.get('application', composedPlugin),
        },
        hookResult
    };
    let toInject = handleInjectable(data);
    fp_1.each((i) => {
        let output = i(GlobalInjector, LogManager);
        if (output) {
            composedPlugin.logger.log(`Added ${output.injectableParam} - ${output.type} to injector.`);
        }
    }, toInject);
    return null;
}
exports.placeInjectables = placeInjectables;
function composeLoadRunner(frameworkConf, LogManager, GlobalInjector) {
    return function loadRunner(composedPlugin) {
        return __awaiter(this, void 0, void 0, function* () {
            let pluginName = fp_1.get('configuration.name', composedPlugin);
            frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'load');
            let ChildInjector = composedPlugin.injector;
            let PluginTimer = ChildInjector.get('PluginTimer');
            let PluginLogger = ChildInjector.get('PluginLogger');
            let hookFn = composedPlugin.hooks['load'];
            PluginLogger.log('Loading');
            let racer = PluginTimer.start();
            let result = bluebird_1.default.try(() => {
                return ChildInjector.inject(hookFn);
            });
            return bluebird_1.default.race([result, racer])
                .then((result) => {
                PluginTimer.reset();
                return placeInjectables(composedPlugin, result, PluginLogger, GlobalInjector, LogManager);
                // return structureInjectables(result, composedPlugin, PluginLogger, GlobalInjector, LogManager)
            })
                .then((result) => {
                let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'load');
                PluginLogger.log(`Loaded in ${elapsed}ms`, 3);
                return pluginName;
            });
        });
    };
}
function composeStartRunner(frameworkConf, LogManager, GlobalInjector) {
    return function startRunner(composedPlugin) {
        return __awaiter(this, void 0, void 0, function* () {
            let pluginName = fp_1.get('configuration.name', composedPlugin);
            frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'start');
            let ChildInjector = composedPlugin.injector;
            let PluginTimer = ChildInjector.get('PluginTimer');
            let PluginLogger = ChildInjector.get('PluginLogger');
            let hookFn = composedPlugin.hooks['start'];
            PluginLogger.log('Starting');
            let racer = PluginTimer.start();
            let result = bluebird_1.default.try(() => {
                return ChildInjector.inject(hookFn);
            });
            return bluebird_1.default.race([result, racer])
                .then((result) => {
                PluginTimer.reset();
                let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'start');
                PluginLogger.log(`Started in ${elapsed}ms`, 3);
                return pluginName;
            });
        });
    };
}
function composeStopRunner(frameworkConf, LogManager, GlobalInjector) {
    return function stopRunner(composedPlugin) {
        return __awaiter(this, void 0, void 0, function* () {
            let pluginName = fp_1.get('configuration.name', composedPlugin);
            frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'stop');
            let ChildInjector = composedPlugin.injector;
            let PluginTimer = ChildInjector.get('PluginTimer');
            let PluginLogger = ChildInjector.get('PluginLogger');
            let hookFn = composedPlugin.hooks['stop'];
            PluginLogger.log('Stopping');
            let racer = PluginTimer.start();
            let result = bluebird_1.default.try(() => {
                return ChildInjector.inject(hookFn);
            });
            return bluebird_1.default.race([result, racer])
                .then((result) => {
                PluginTimer.reset();
                let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'stop');
                PluginLogger.log(`Stopped in ${elapsed}ms`, 3);
                return pluginName;
            })
                .catch((err) => {
                PluginLogger.error(err.message);
                throw err;
            });
        });
    };
}
function composeHookRunners(frameworkConf, LogManager, GlobalInjector) {
    return {
        runLoadHook: composeLoadRunner(frameworkConf, LogManager, GlobalInjector),
        runStartHook: composeStartRunner(frameworkConf, LogManager, GlobalInjector),
        runStopHook: composeStopRunner(frameworkConf, LogManager, GlobalInjector)
    };
}
exports.composeHookRunners = composeHookRunners;
//# sourceMappingURL=runHook.js.map