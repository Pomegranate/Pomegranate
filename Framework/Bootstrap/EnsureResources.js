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
const bluebird_1 = __importDefault(require("bluebird"));
const FutureState_1 = require("../Common/FutureState");
const fp_1 = require("lodash/fp");
const helpers_1 = require("../Configuration/helpers");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
/**
 * @file EnsureResources
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
function EnsureResources(pomConf, LogManager, frameworkMetrics, PluginInjector) {
    return function (composedPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Checking plugin resource availability' });
            frameworkMetrics.startFrameworkPhase('EnsureResources');
            return bluebird_1.default.map(composedPlugins, (composed) => {
                return FutureState_1.FutureState(composed)
                    .map((skeleton, collector) => __awaiter(this, void 0, void 0, function* () {
                    if (skeleton.runtimeDirectories) {
                        yield bluebird_1.default.each(fp_1.toPairs(skeleton.runtimeDirectories), ([key, dirPath]) => __awaiter(this, void 0, void 0, function* () {
                            yield helpers_1.directoryExists(dirPath);
                        }));
                    }
                    return collector;
                }))
                    .map((skeleton, collector) => {
                    let c = fp_1.assign(collector, skeleton);
                    return c;
                })
                    .run({})
                    .catch((err) => {
                    throw err;
                });
            })
                .then((result) => {
                LogManager.use('pomegranate').log(`Plugin resource checks took ${frameworkMetrics.stopFrameworkPhase('EnsureResources')}ms.`, 3);
                return result;
            });
        });
    };
}
exports.EnsureResources = EnsureResources;
//# sourceMappingURL=EnsureResources.js.map