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
let computeCase = fp_1.get('type');
function composite(plugin, LogManager) {
    let injectables = fp_1.get('result', plugin);
    return fp_1.flattenDeep(fp_1.map((result) => {
        let type = result.type ? result.type : 'anything';
        return structure(type, result.injectableParam, result.value);
    }, injectables));
}
function injectable(plugin, type) {
    return (parentInjector, LogManager) => {
        let injectableParam = fp_1.get('injectableParam', plugin); //?
        let injectableValue = fp_1.get('result', plugin);
        parentInjector[type](injectableParam, injectableValue);
        return injectableParam;
    };
}
function loghandler(plugin) {
    return (parentInjector, LogManager) => {
        let injectableValue = fp_1.get('result', plugin);
        LogManager.addHandler(injectableValue);
        return null;
    };
}
const typeFuns = {
    action: (v) => {
        return [];
    },
    anything: (v) => {
        return [injectable(v, 'service')];
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
function structure(type, injectableParam, result) {
    return handleInjectable({ type, injectableParam, result });
}
// export function switchInjectables(type: string, injectableParam: string, value: any) {
//   switch (type) {
//     case 'action':
//       return []
//     case 'anything':
//       return [{type: 'service', injectableParam, value}]
//     case 'composite':
//       return flattenDeep(map((iResult) => {
//
//         let type = iResult.type ? iResult.type : 'anything'
//         return switchInjectables(type, iResult.injectableParam, iResult.value)
//       }, value))
//     case 'factory':
//       return [{type: 'factory', injectableParam, value}]
//     case 'instance':
//       return [{type: 'instance', injectableParam, value}]
//     case 'merge':
//       return [{type: 'merge', injectableParam, value}]
//     case 'loghandler':
//       return [(LogManager) => {
//         LogManager.addHandler(value)
//       }]
//     default:
//       throw new Error('Unable to handle this plugins dependency.')
//
//   }
// }
function structureInjectables(result, composedPlugin, pluginLogger, pluginInjector, LogManager) {
    let type = fp_1.get('configuration.type', composedPlugin);
    let injectableParam = fp_1.get('configuration.injectableParam', composedPlugin);
    let parentInjector = pluginInjector.getParent(true);
    let toInject = structure(type, injectableParam, result);
    fp_1.each((i) => {
        let addedParam = i(parentInjector, LogManager);
        if (addedParam) {
            composedPlugin.logger.log(`Added ${type} as ${addedParam} to injector.`);
        }
    }, toInject);
    // console.log(composedPlugin)
    // let injectables = switchInjectables(type, injectableParam, result)
    // console.log(injectables)
    // each((injectable) => {
    //   if(isFunction(injectable) ){
    //     injectable(LogManager)
    //     return
    //   }
    //   pluginLogger.log(`Adding ${injectable.type} as ${injectable.injectableParam} to injector.`)
    //   parentInjector[injectable.type](injectable.injectableParam, injectable.value)
    // }, injectables)
    return null;
}
exports.structureInjectables = structureInjectables;
function composeLoadRunner(frameworkConf, LogManager, PluginInjector) {
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
                return structureInjectables(result, composedPlugin, PluginLogger, ChildInjector, LogManager);
            })
                .then((result) => {
                let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'load');
                PluginLogger.log(`Loaded in ${elapsed}ms`, 3);
                return pluginName;
            });
        });
    };
}
function composeStartRunner(frameworkConf, LogManager, PluginInjector) {
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
function composeStopRunner(frameworkConf, LogManager, PluginInjector) {
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
                console.log(err);
                throw err;
            });
        });
    };
}
function composeHookRunners(frameworkConf, LogManager, PluginInjector) {
    return {
        runLoadHook: composeLoadRunner(frameworkConf, LogManager, PluginInjector),
        runStartHook: composeStartRunner(frameworkConf, LogManager, PluginInjector),
        runStopHook: composeStopRunner(frameworkConf, LogManager, PluginInjector)
    };
}
exports.composeHookRunners = composeHookRunners;
//# sourceMappingURL=runHook.js.map