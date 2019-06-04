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
// No longer - Adds @pomOfficial to the namespace search list if it is missing.
// let normalizeNamespaces = compose(
//   map((ns: string) => {
//     return startsWithAt(ns) ? ns : `@${ns}`
//   }),
//   get('pluginNamespaces')
// )
let normalizeNamespaces = fp_1.map((ns) => {
    return startsWithAt(ns) ? ns : `@${ns}`;
});
const filterNamespaces = namespaces => fp_1.compose(fp_1.fromPairs, fp_1.filter(([module, version]) => {
    let ns = getNamespace(module);
    return ns && fp_1.includes(ns, namespaces);
}), fp_1.toPairs);
function RequirePlugins(FrameworkConfiguration, LogManager) {
    return __awaiter(this, void 0, void 0, function* () {
        let p = yield AddUtilities_1.Plugin.getPlugin();
        let frameworkPlugins = yield discoverPlugins_1.discoverFramework([p]);
        LogManager.use('pomegranate').log(`Found ${frameworkPlugins.length} framework plugins.`);
        let namespaces = normalizeNamespaces(FrameworkConfiguration.getKey('pluginNamespaces'));
        LogManager.use('pomegranate').log(`Loading namespaced plugins from ${namespaces.join(', ')}.`);
        // Extract only the plugins with namespaces in config.pluginNamespaces
        let namespaceFilter = filterNamespaces(namespaces);
        let nsdeps = namespaceFilter(FrameworkConfiguration.getKey('pkgDependencies'));
        let externalNamespaced = yield discoverPlugins_1.discoverNamespaced(nsdeps);
        LogManager.use('pomegranate').log(`Found ${externalNamespaced.length} namespaced plugins.`);
        let localPlugins = yield discoverPlugins_1.discoverLocal(FrameworkConfiguration.getKey('buildDirs.pluginDirectory'));
        LogManager.use('pomegranate').log(`Found ${localPlugins.length} local plugins.`);
        return fp_1.flattenDeep(fp_1.concat(frameworkPlugins, [externalNamespaced, localPlugins]));
    });
}
exports.RequirePlugins = RequirePlugins;
//# sourceMappingURL=RequirePlugins.js.map