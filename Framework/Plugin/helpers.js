"use strict";
/**
 * @file helpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const ArrayMethods_1 = require("../Common/ArrayMethods");
exports.getName = fp_1.get('configuration.name');
exports.getDirectories = fp_1.get('directories');
exports.getParents = fp_1.get('parents');
exports.getNamespace = fp_1.get('namespace');
exports.hasParents = (parents) => {
    return !!(parents.length);
};
exports.getFqn = fp_1.get('configuration.name');
exports.fqDeclaredName = fp_1.memoize((fqn) => {
    return fp_1.last(fqn);
});
exports.fqShortName = fp_1.memoize((fqn) => {
    let ns = fp_1.first(fqn);
    return (fp_1.startsWith('@', ns) ? [ns, fp_1.last(fqn)] : [fp_1.last(fqn)]);
});
exports.fqParentName = fp_1.memoize((fqn) => {
    let ns = fp_1.first(fqn);
    return (fp_1.startsWith('@', ns) ? [ns, fqn[1]] : [fqn[0]]);
});
exports.joinFqParentname = fp_1.compose(fp_1.join('/'), exports.fqParentName);
exports.joinFqShortname = fp_1.compose(fp_1.join('/'), exports.fqShortName);
exports.getFqParentname = fp_1.compose(exports.joinFqParentname, exports.getFqn);
exports.getFqShortname = fp_1.compose(exports.joinFqShortname, exports.getFqn);
exports.fqLineage = fp_1.memoize((fqn) => {
    return fp_1.initial(fqn);
});
exports.hasDirectories = (plugin) => {
    return !!(exports.getDirectories(plugin).length);
};
exports.directoryBasePath = (plugin) => {
    return fp_1.join('/', exports.getName(plugin));
};
exports.configObjectPath = fp_1.curry((plugin, appendPath) => {
    let parents = exports.getParents(plugin);
    // return hasParents(parents) ? append([...tail(parents), last(plugin.configuration.name)]) : append([])
    return ArrayMethods_1.append((exports.hasParents(parents) ? [...fp_1.tail(parents), fp_1.last(plugin.configuration.name)] : []), [appendPath]).join('.');
});
exports.configPath = (plugin) => {
    let parents = exports.getParents(plugin);
    return (exports.hasParents(parents) ? [...fp_1.tail(parents), fp_1.last(plugin.configuration.name)] : []);
};
exports.getConfigFilePath = (plugin) => {
    let Parents = fp_1.get('parents', plugin);
    let BaseFile = Parents.length ? fp_1.first(Parents) : exports.fqDeclaredName(plugin.configuration.name);
    let Namespace = fp_1.get('namespace', plugin);
    return Namespace ? `${Namespace}/${BaseFile}` : BaseFile;
};
//# sourceMappingURL=helpers.js.map