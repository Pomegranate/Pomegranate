"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Topological_1 = require("./Topological");
const fp_1 = require("lodash/fp");
const helpers_1 = require("../Plugin/helpers");
const getInjectableParam = fp_1.get('configuration.injectableParam');
const getName = helpers_1.getFqShortname;
const getDepends = fp_1.getOr([], 'configuration.depends');
const getOptional = fp_1.getOr([], 'configuration.optional');
const getProvides = fp_1.getOr([], 'configuration.provides');
const extractDeps = fp_1.map((p) => {
    if (getInjectableParam(p)) {
        return { injectableParam: getInjectableParam(p), name: getName(p) };
    }
    return false;
});
const groupByParams = fp_1.compose(fp_1.groupBy('injectableParam'), fp_1.filter(Boolean), extractDeps);
const generateDeps = (grouped) => fp_1.compose(fp_1.flatten, fp_1.map((p) => {
    if (grouped[p]) {
        return fp_1.map((inj) => {
            return inj.name;
        }, grouped[p]);
    }
    return p;
}));
const extractPluginOrder = (plugins) => {
    let keyedPlugins = fp_1.keyBy(helpers_1.getFqShortname, plugins);
    let mapFn = fp_1.map((key) => {
        return keyedPlugins[key];
    });
    //@ts-ignore
    return fp_1.compose(fp_1.map(helpers_1.getFqShortname), fp_1.filter(fp_1.isObject), mapFn);
};
const getFramework = p => p.configuration.frameworkPlugin;
const noFramework = fp_1.filter(fp_1.negate(getFramework));
const onlyFramework = fp_1.filter(getFramework);
function solveOrdering(plugins) {
    let topo = new Topological_1.Topological();
    let groupedByInjectable = groupByParams(plugins);
    let flattenDeps = generateDeps(groupedByInjectable);
    let notFramework = fp_1.filter(fp_1.negate(getFramework), plugins);
    let framework = fp_1.filter(getFramework, plugins);
    fp_1.each((plugin) => {
        let name = helpers_1.getFqShortname(plugin);
        let requiredDeps = flattenDeps(getDepends(plugin));
        let optionalDeps = flattenDeps(getOptional(plugin));
        // @ts-ignore
        topo.add(name, requiredDeps);
        // @ts-ignore
        topo.add(name, optionalDeps);
        if (fp_1.isArray(getProvides(plugin))) {
            fp_1.each((p) => {
                if (p !== name) {
                    topo.add(p, name);
                }
            }, plugin.configuration.provides);
        }
    }, noFramework(plugins));
    let extract = extractPluginOrder(plugins);
    let frameworkFirst = fp_1.map(helpers_1.getFqShortname, framework);
    let externalPlugins = extract(topo.sort());
    return [...frameworkFirst, ...externalPlugins];
}
exports.solveOrdering = solveOrdering;
//# sourceMappingURL=solveOrdering.js.map