"use strict";
/**
 * @file ValidatePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
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
const buildPluginSkeletons_1 = require("../buildPluginSkeletons");
const ErrorReporters_1 = require("../Common/ErrorReporters");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
function ValidatePlugins(PomConfig, LogManager, GlobalInjector, loadedPlugins) {
    return __awaiter(this, void 0, void 0, function* () {
        frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Validating Plugins' });
        PomConfig.FrameworkMetrics.startFrameworkPhase('CreatePluginValidator');
        function PluginValidator(rawModules) {
            return __awaiter(this, void 0, void 0, function* () {
                let createSkeletons = buildPluginSkeletons_1.buildPluginSkeletons(PomConfig, LogManager, GlobalInjector);
                let skeletons = yield createSkeletons(rawModules);
                return skeletons;
            });
        }
        try {
            let validatedPlugins = yield PluginValidator(loadedPlugins);
            LogManager.use('pomegranate').log(`Plugin validation took ${PomConfig.FrameworkMetrics.stopFrameworkPhase('CreatePluginValidator')}ms.`, 3);
            return validatedPlugins;
        }
        catch (e) {
            ErrorReporters_1.reportCommonErrors(e, LogManager.use('system'));
            throw new Error('Plugin Creation and validation failed.');
        }
    });
}
exports.ValidatePlugins = ValidatePlugins;
//# sourceMappingURL=ValidatePlugins.js.map