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
 * @file buildPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const Configuration_1 = require("./Configuration");
const Configuration_2 = require("./Configuration");
const fp_1 = require("lodash/fp");
const bluebird_1 = __importDefault(require("bluebird"));
exports.buildCLIPluginSkeletons = (FrameworkState, PluginInjector) => {
    let applicationDirectory = fp_1.get('applicationDirectory', FrameworkState);
    let SkeletonValidator = Configuration_1.pluginConfig(FrameworkState, PluginInjector);
    return function (skeletons) {
        return __awaiter(this, void 0, void 0, function* () {
            return bluebird_1.default.map(skeletons, (p) => {
                return SkeletonValidator(p);
            });
        });
    };
};
exports.buildPluginSkeletons = (FrameworkState, LogManager, GlobalInjector) => {
    let applicationDirectory = fp_1.get('applicationDirectory', FrameworkState);
    // let SkeletonValidator = pluginConfig(FrameworkState, GlobalInjector)
    let SkeletonValidator = Configuration_2.transformPlugin(FrameworkState, GlobalInjector);
    return function (skeletons) {
        return __awaiter(this, void 0, void 0, function* () {
            return bluebird_1.default.map(skeletons, (p) => __awaiter(this, void 0, void 0, function* () {
                p.computedMetadata = yield SkeletonValidator(p);
                return p;
                // return SkeletonValidator(p)
            }))
                .then((result) => {
                LogManager.use('pomegranate').log(`${result.length} Plugins valid`, 2);
                return result;
            });
        });
    };
};
//# sourceMappingURL=buildPluginSkeletons.js.map