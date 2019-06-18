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
 * @file createPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const FutureState_1 = require("./Common/FutureState");
const lodash_fun_1 = require("lodash-fun");
const fp_1 = require("lodash/fp");
const lodash_fun_2 = require("lodash-fun");
const bluebird_1 = __importDefault(require("bluebird"));
const Dependency_1 = require("./Dependency");
const helpers_1 = require("./Configuration/helpers");
const helpers_2 = require("./Plugin/helpers");
const ComposeDirectories_1 = require("./Plugin/ComposeDirectories");
const frameworkOutputs_1 = require("./Common/frameworkOutputs");
exports.composePlugins = (FrameworkConfiguration, LogManager, frameworkMetrics, loggerFactory, PluginDI) => {
    const composePlugin = lodash_fun_1.composeP((plugin) => __awaiter(this, void 0, void 0, function* () {
    }));
    return function (skeletons) {
        frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Initializing Plugins.' });
        frameworkMetrics.startFrameworkPhase('InitializePlugins');
        return bluebird_1.default.map(skeletons, (skeleton) => {
            let PluginName = helpers_2.getFqShortname(skeleton);
            let pullProp = helpers_2.configObjectPath(skeleton);
            frameworkMetrics.startPluginPhase(PluginName, 'initialize');
            return FutureState_1.FutureState(skeleton)
                .map((skeleton, collector) => __awaiter(this, void 0, void 0, function* () {
                let fileVars = yield helpers_1.requireFile(FrameworkConfiguration.getKey('buildDirs.pluginConfigDirectory'), `${helpers_2.getConfigFilePath(skeleton)}.js`);
                let inject = fp_1.isFunction(fileVars) ? PluginDI.inject(fileVars) : fileVars;
                let vars = fp_1.getOr(skeleton.state.variables, pullProp('variables'), inject);
                let conf = fp_1.getOr({ disabled: false, additionalDependencies: [] }, pullProp('config'), inject);
                let missingKeys = lodash_fun_2.missingKeysDeep(skeleton.state.variables, vars);
                if (missingKeys.length) {
                    throw new Error(`Plugin "${skeleton.state.configuration.name}" config file does not conform with plugin defaults. \n Missing ${missingKeys.join(',')} keys.`);
                }
                collector.runtimeConfiguration = conf;
                collector.runtimeVariables = vars;
                return collector;
            }))
                .map(ComposeDirectories_1.ComposeDirectories(FrameworkConfiguration))
                .map((skeleton, collector) => {
                let logLevel = fp_1.get('runtimeConfiguration.logLevel', collector);
                let configFormatting = fp_1.get('runtimeConfiguration.logFormat', collector);
                let formatting = fp_1.isObject(configFormatting) ? configFormatting : { log: ['green'] };
                collector.logger = LogManager.createLogger({ source: PluginName, logLevel: logLevel, logFormat: formatting }); //loggerFactory.run(loggerConf)
                collector.logger.log('Initializing.');
                return collector;
            })
                .map((skeleton, collector) => {
                collector.timeout = FrameworkConfiguration.getKey('timeout');
                //@ts-ignore
                let missingDeps = fp_1.difference(skeleton.state.configuration.depends, FrameworkConfiguration.getKey('runtime.allAvailable'));
                let missingAdditional = fp_1.difference(collector.runtimeConfiguration.additionalDependencies, FrameworkConfiguration.getKey('runtime.allAvailable'));
                if (missingAdditional.length) {
                    //@ts-ignore
                    collector.logger.error(`Missing requested additionalDependencies from runtime config: ${missingAdditional.join(', ')}`, 0);
                    throw new Error('Missing additionalDependencies');
                }
                if (missingDeps.length) {
                    //@ts-ignore
                    collector.logger.error(`Missing required dependencies: ${missingDeps.join(', ')}`, 0);
                    throw new Error('Missing dependencies');
                }
                collector.missingDependencies = missingDeps;
                return collector;
            })
                .map((skeleton, collector) => {
                let c = fp_1.assign(collector, skeleton);
                return c;
            })
                .map((skeleton, collector) => {
                collector.state.configuration.depends =
                    Dependency_1.provideDependencies(fp_1.get('state.configuration.name', collector), fp_1.getOr([], 'state.configuration.depends', collector), FrameworkConfiguration.getKey('runtime.providingPlugins'));
                return collector;
            })
                .run({})
                .then((result) => {
                result.logger.log(`Initialized in ${frameworkMetrics.stopPluginPhase(PluginName, 'initialize')}ms`, 3);
                return result;
            });
        })
            .then((results) => {
            LogManager.use('pomegranate').log(`Plugin initialization took ${frameworkMetrics.stopFrameworkPhase('InitializePlugins')}ms.`, 3);
            return results;
        })
            .catch((error) => {
            LogManager.use('pomegranate').error('Plugin errored during composition.');
            LogManager.use('pomegranate').error(error);
            throw error;
        });
    };
};
//# sourceMappingURL=composePlugins.js.map