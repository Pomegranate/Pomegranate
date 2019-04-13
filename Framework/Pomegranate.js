"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Pomegranate
 * @description Pomegranate is a unified application
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const events_1 = require("events");
const immutable_dll_1 = require("immutable-dll");
const Versions_1 = require("./Versions");
const Configuration_1 = require("./Configuration");
const magnum_di_1 = require("magnum-di");
const composePlugins_1 = require("./composePlugins");
const FrameworkMetrics_1 = require("./FrameworkMetrics");
const runHook_1 = require("./Plugin/runHook");
const frameworkOutputs_1 = require("./Common/frameworkOutputs");
const helpers_1 = require("./Plugin/helpers");
const stringFuns_1 = require("./Common/stringFuns");
const Handlebars = __importStar(require("handlebars"));
const pluginPluralizer = stringFuns_1.pluralizer({ negative: 'plugins', zero: 'plugins', many: 'plugins', one: 'plugin' });
const isCommand = fp_1.matchesProperty('configuration.type', 'command');
const Bootstrap_1 = require("./Bootstrap");
function installPlugins(plugins) {
    return __awaiter(this, void 0, void 0, function* () {
        let installers = fp_1.map((plugin) => {
            return plugin.installs;
        }, plugins);
    });
}
function RunCLI(baseDirectory, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let FrameworkEvents = new events_1.EventEmitter();
        let RuntimeState = {};
        let GlobalInjector = new magnum_di_1.MagnumDI();
        GlobalInjector.anything('Env', process.env);
        GlobalInjector.anything('Handlebars', Handlebars);
        let frameworkMetrics = FrameworkMetrics_1.FrameworkMetrics();
        /*
         * Loads and validates the application config, creates the pomegranate framework logger.
         */
        const { PomConfig, FrameworkConfiguration, loggerFactory, frameworkLogger, systemLogger, LogManager } = yield Bootstrap_1.Configure(frameworkMetrics, baseDirectory, config);
        const FutureFrameworkState = yield Bootstrap_1.CreateFrameworkState(frameworkLogger, FrameworkConfiguration);
        const FrameworkState = yield FutureFrameworkState.getState();
        /*
         * Loads plugins from all sources: Framework, Local and Namespaced.
         */
        let loadedPlugins = yield Bootstrap_1.LoadPlugins(FrameworkState, LogManager);
        /*
         * Validates plugin types, values and usage constraints.
         */
        let validatedPlugins = yield Bootstrap_1.ValidatePlugins(FrameworkState, LogManager, GlobalInjector, loadedPlugins);
        /*
         * Extract global configuration data from all plugins, including the master required plugin array.
         */
        let FullConfig = yield Configuration_1.updateFrameworkMeta(LogManager, frameworkMetrics, FutureFrameworkState, validatedPlugins);
        GlobalInjector.anything('PomConfig', FullConfig);
        /*
         * Updates plugins with global state. Attaches all needed properties for downstream use.
         */
        let compPlugins = composePlugins_1.composePlugins(FullConfig, LogManager, frameworkMetrics, loggerFactory, GlobalInjector);
        let composed = yield compPlugins(validatedPlugins);
        let finalPlugins = Bootstrap_1.PopulateCliInjectors(GlobalInjector, composed);
        return { Plugins: finalPlugins, Config: FullConfig };
    });
}
exports.RunCLI = RunCLI;
function Pomegranate(baseDirectory, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let FrameworkEvents = new events_1.EventEmitter();
        let RuntimeState = {
            loadedPlugins: [],
            startedPlugins: [],
            stoppedPlugins: [],
            isFailed: false,
            failureError: null
        };
        let GlobalInjector = new magnum_di_1.MagnumDI();
        GlobalInjector.anything('Env', process.env);
        let frameworkMetrics = FrameworkMetrics_1.FrameworkMetrics();
        /*
         * Loads and validates the application config, creates the pomegranate framework logger.
         */
        const { PomConfig, FrameworkConfiguration, loggerFactory, frameworkLogger, LogManager } = yield Bootstrap_1.Configure(frameworkMetrics, baseDirectory, config);
        const FutureFrameworkState = yield Bootstrap_1.CreateFrameworkState(frameworkLogger, FrameworkConfiguration);
        const FrameworkState = yield FutureFrameworkState.getState();
        // Log in use versions.
        Versions_1.Versions(LogManager.use('pomegranate'));
        /*
         * Loads plugins from all sources: Framework, Local and Namespaced.
         */
        let allPlugins = yield Bootstrap_1.LoadPlugins(FrameworkState, LogManager);
        let loadedPlugins = fp_1.filter((plugin) => {
            return !isCommand(plugin);
        }, allPlugins);
        /*
         * Validates plugin types, values and usage constraints.
         */
        let validatedPlugins = yield Bootstrap_1.ValidatePlugins(FrameworkState, LogManager, GlobalInjector, loadedPlugins);
        /*
         * Extract global configuration data from all plugins, including the master required plugin array.
         */
        let FullConfig = yield Configuration_1.updateFrameworkMeta(LogManager, frameworkMetrics, FutureFrameworkState, validatedPlugins);
        GlobalInjector.anything('PomConfig', FullConfig);
        /*
         * Updates plugins with global state. Attaches all needed properties for downstream use.
         */
        let compPlugins = composePlugins_1.composePlugins(FullConfig, LogManager, frameworkMetrics, loggerFactory, GlobalInjector);
        let composed = yield compPlugins(validatedPlugins);
        /*
         * Validate our current plugins, load config files, ensure directories are available.
         */
        let ensure = Bootstrap_1.EnsureResources(PomConfig, LogManager, frameworkMetrics, GlobalInjector);
        let resourcesEnsured = yield ensure(composed);
        /*
         * Override any plugins as needed.
         */
        let readyPlugins = Bootstrap_1.OverridePlugins(LogManager, frameworkMetrics, resourcesEnsured);
        /*
         * Create and populate Magnum-Di child injectors for each plugin.
         */
        let finalPlugins = Bootstrap_1.PopulateInjectors(LogManager, frameworkMetrics, GlobalInjector, FrameworkEvents, readyPlugins);
        /**
         * TODO - Leave this for the CLI
         * @author - Jim Bulkowski
         * @date - 2019-02-21
         * @time - 15:16
         */
        yield installPlugins(composed);
        let orderedPlugins = Bootstrap_1.OrderPlugins(LogManager, frameworkMetrics, finalPlugins);
        // Create the Doubly linked list.
        let PList = immutable_dll_1.DLinkedList.fromArray(orderedPlugins);
        let { runLoadHook, runStartHook, runStopHook } = runHook_1.composeHookRunners(PomConfig, LogManager, GlobalInjector);
        LogManager.use('system').log('Pomegranate Ready.', 2);
        return {
            events: FrameworkEvents,
            externalLog: (method, msg) => {
                LogManager.use('system')[method](msg);
            },
            load: function runLoadHooks() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Running Load hooks.' });
                        frameworkMetrics.startFrameworkPhase('LoadHook');
                        let results = yield PList.asyncReduce((acc, composedPlugin) => __awaiter(this, void 0, void 0, function* () {
                            let result = yield runLoadHook(composedPlugin);
                            (acc.loadedPlugins || (acc.loadedPlugins = [])).push(helpers_1.joinFqShortname(result));
                            return acc;
                        }), RuntimeState);
                        LogManager.use('pomegranate').log(`Load Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('LoadHook')}ms.`, 3);
                        LogManager.use('system').log('Pomegranate loaded...', 2);
                        return RuntimeState;
                    }
                    catch (e) {
                        RuntimeState.isFailed = true;
                        RuntimeState.failureError = e;
                        LogManager.use('pomegranate').error(e.message, 0);
                        return RuntimeState;
                    }
                });
            },
            start: function runStartHooks() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (RuntimeState.isFailed) {
                        return RuntimeState;
                    }
                    try {
                        frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Running Start hooks.' });
                        frameworkMetrics.startFrameworkPhase('StartHook');
                        let results = yield PList.asyncReduce((acc, composedPlugin) => __awaiter(this, void 0, void 0, function* () {
                            if (acc.startFailed) {
                                (acc.startSkipped || (acc.startSkipped = [])).push(helpers_1.getFqShortname(composedPlugin));
                                return acc;
                            }
                            try {
                                let result = yield runStartHook(composedPlugin);
                                (acc.startedPlugins || (acc.startedPlugins = [])).push(helpers_1.joinFqShortname(result));
                            }
                            catch (e) {
                                acc.startError = e;
                                (acc.startFailed || (acc.startFailed = [])).push(helpers_1.getFqShortname(composedPlugin));
                            }
                            return acc;
                        }), RuntimeState);
                        if (RuntimeState.startError) {
                            RuntimeState.isFailed = true;
                            LogManager.use('pomegranate').error(RuntimeState.startError, 0);
                            frameworkLogger.error(`${RuntimeState.startFailed.join()} failed on Start hook.`, 0);
                            // frameworkLogger.error('Stop hooks running automatically on started plugins.', 0)
                            // return this.stop()
                            return RuntimeState;
                        }
                        LogManager.use('pomegranate').log(`Start Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('StartHook')}ms.`, 3);
                        LogManager.use('system').log('Pomegranate started...', 2);
                        return RuntimeState;
                    }
                    catch (e) {
                        RuntimeState.isFailed = true;
                        RuntimeState.failureError = e;
                        return RuntimeState;
                    }
                });
            },
            stop: function runStopHooks() {
                return __awaiter(this, void 0, void 0, function* () {
                    frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Running Stop hooks.' });
                    frameworkMetrics.startFrameworkPhase('StopHook');
                    let startedPlugins = PList.filter((p) => {
                        return RuntimeState.startedPlugins.indexOf(helpers_1.getFqShortname(p)) >= 0;
                    });
                    let startedCount = startedPlugins.length;
                    LogManager.use('pomegranate').log(`Stopping ${startedCount} ${pluginPluralizer(startedCount)}.`, 3);
                    let results = yield startedPlugins.asyncReduceRight((acc, composedPlugin) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let result = yield runStopHook(composedPlugin);
                            (acc.stoppedPlugins || (acc.stoppedPlugins = [])).push(helpers_1.joinFqShortname(result));
                        }
                        catch (e) {
                            acc.stopError = e;
                            (acc.stopFailed || (acc.stopFailed = [])).push(helpers_1.getFqShortname(composedPlugin));
                        }
                        return acc;
                    }), RuntimeState);
                    LogManager.use('pomegranate').log(`Stop Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('StopHook')}ms.`, 3);
                    LogManager.use('system').log('Pomegranate finished...', 2);
                    return RuntimeState;
                });
            }
        };
    });
}
exports.Pomegranate = Pomegranate;
//# sourceMappingURL=Pomegranate.js.map