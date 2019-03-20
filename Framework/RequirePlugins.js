"use strict";
/**
 * @file RequirePlugins
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
const discoverPlugins_1 = require("./discoverPlugins");
const AddUtilities_1 = require("./FrameworkPlugins/AddUtilities");
const fp_1 = require("lodash/fp");
const startsWithAt = fp_1.startsWith('@');
const getNamespace = mod => startsWithAt(mod) ? fp_1.split('/', mod)[0] : null;
// Adds @pomOfficial to the namespace search list if it is missing.
let normalizeNamespaces = fp_1.compose((namespaces) => {
    return fp_1.includes('@pomOfficial', namespaces) ? namespaces : fp_1.concat(['@pomOfficial'], namespaces);
}, fp_1.map((ns) => {
    return startsWithAt(ns) ? ns : `@${ns}`;
}), fp_1.get('pluginNamespaces'));
const filterNamespaces = namespaces => fp_1.compose(fp_1.fromPairs, fp_1.filter(([module, version]) => {
    let ns = getNamespace(module);
    return ns && fp_1.includes(ns, namespaces);
}), fp_1.toPairs, fp_1.get('pkgDependencies'));
function RequirePlugins(pomConfig, LogManager) {
    return __awaiter(this, void 0, void 0, function* () {
        let frameworkPlugins = yield discoverPlugins_1.discoverFramework([AddUtilities_1.Plugin.getPlugin().state]);
        LogManager.use('pomegranate').log(`Found ${frameworkPlugins.length} framework plugins.`);
        let namespaces = normalizeNamespaces(pomConfig);
        LogManager.use('pomegranate').log(`Loading namespaced plugins from ${namespaces.join(', ')}.`);
        // Extract only the plugins with namespaces in config.pluginNamespaces
        let namespaceFilter = filterNamespaces(namespaces);
        let nsdeps = namespaceFilter(pomConfig);
        let externalNamespaced = yield discoverPlugins_1.discoverNamespaced(nsdeps);
        LogManager.use('pomegranate').log(`Found ${externalNamespaced.length} namespaced plugins.`);
        let localPlugins = yield discoverPlugins_1.discoverLocal(fp_1.get('pluginDirectory', pomConfig));
        LogManager.use('pomegranate').log(`Found ${localPlugins.length} local plugins.`);
        return fp_1.flattenDeep(fp_1.concat(frameworkPlugins, [externalNamespaced, localPlugins]));
    });
}
exports.RequirePlugins = RequirePlugins;
//# sourceMappingURL=RequirePlugins.js.map