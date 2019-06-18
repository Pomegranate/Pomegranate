"use strict";
/**
 * @file solveOrdering
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Topological_1 = require("./Topological");
const fp_1 = require("lodash/fp");
const helpers_1 = require("../Plugin/helpers");
const getInjectableParam = fp_1.get('state.configuration.injectableParam');
const getName = helpers_1.getFqShortname;
const getDepends = fp_1.getOr([], 'state.configuration.depends');
const getOptional = fp_1.getOr([], 'state.configuration.optional');
const getProvides = fp_1.getOr([], 'state.configuration.provides');
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
const getFramework = p => p.state.configuration.frameworkPlugin;
const noFramework = fp_1.filter(fp_1.negate(getFramework));
const encumberedPlugin = (plugin) => {
    return fp_1.some(Boolean, [getDepends(plugin).length, getProvides(plugin).length, getOptional(plugin).length]);
};
const findUnEncumbered = fp_1.filter(fp_1.negate(encumberedPlugin));
const findEncumbered = fp_1.filter(encumberedPlugin);
const onlyFramework = fp_1.filter(getFramework);
function solveOrdering(plugins) {
    let topo = new Topological_1.Topological();
    let groupedByInjectable = groupByParams(plugins);
    let flattenDeps = generateDeps(groupedByInjectable);
    let framework = fp_1.filter(getFramework, plugins);
    let encumbered = findEncumbered(noFramework(plugins));
    let unEncumbered = findUnEncumbered(noFramework(plugins));
    // Add Dependency free plugins to the toposorter first
    let top = fp_1.map((plugin) => {
        // console.log(plugin)
        let depends = [...flattenDeps(getDepends(plugin)), ...fp_1.getOr([], 'runtimeConfiguration.additionalDependencies', plugin)];
        let optional = flattenDeps(getOptional(plugin));
        let provides = flattenDeps(getProvides(plugin));
        let deps = {
            depends: depends,
            optional: optional,
            provides: provides,
            frameworkPlugin: fp_1.getOr(false, 'state.configuration.frameworkPlugin', plugin),
            encumbered: !!fp_1.some(Boolean, [depends.length, optional.length, provides.length])
        };
        return [helpers_1.getFqShortname(plugin), deps];
    }, plugins);
    // console.log(fromPairs(top))
    let f = fp_1.filter(([name, plugin]) => {
        //@ts-ignore
        return plugin.frameworkPlugin;
    }, top);
    let u = fp_1.filter(([name, plugin]) => {
        //@ts-ignore
        return !plugin.encumbered && !plugin.frameworkPlugin;
    }, top);
    let e = fp_1.filter(([name, plugin]) => {
        //@ts-ignore
        return plugin.encumbered && !plugin.frameworkPlugin;
    }, top);
    console.log(f, 'framework');
    console.log(u, 'unencumberd');
    console.log(e, 'encumbered');
    fp_1.each(([name, plugin]) => {
        // console.log(name)
        topo.add(name, []);
    }, u);
    fp_1.each(([name, plugin]) => {
        console.log(name, plugin.depends);
        topo.add(name, plugin.depends);
        topo.add(name, plugin.optional);
        fp_1.each((provide) => {
            if (provide !== name) {
                topo.add(provide, name);
            }
        }, plugin.provides);
    }, e);
    // each((plugin: any) => {
    //   let name = getFqShortname(plugin)
    //   topo.add(name, [])
    //
    // }, unEncumbered)
    // Followed by plugins that actually need to be sorted.
    // each((plugin: any) => {
    //   // console.log(plugin.runtimeConfiguration)
    //   let name = getFqShortname(plugin)
    //   // console.log(name, plugin.runtimeConfiguration)
    //   let requiredDeps = flattenDeps(getDepends(plugin))
    //   // console.log(requiredDeps, 'req')
    //   let optionalDeps = flattenDeps(getOptional(plugin))
    //   // console.log(optionalDeps, 'opt')
    //   // @ts-ignore
    //
    //   topo.add(name, requiredDeps)
    //   // @ts-ignore
    //   topo.add(name, optionalDeps)
    //
    //   if(isArray(getProvides(plugin))){
    //     each((p) => {
    //       if(p !== name){
    //         topo.add(p, name)
    //       }
    //
    //     }, plugin.state.configuration.provides)
    //   }
    //
    // // }, noFramework(plugins))
    // }, encumbered)
    let handleAdditional = fp_1.compose(fp_1.each(([name, deps]) => {
        // console.log(name, deps)
        fp_1.each((d) => {
            topo.add(d, name);
        }, deps);
    }), fp_1.filter(([name, deps]) => {
        return deps.length;
    }), fp_1.map((plugin) => {
        return [helpers_1.getFqShortname(plugin), fp_1.get('runtimeConfiguration.additionalDependencies', plugin)];
    }));
    let extract = extractPluginOrder(plugins);
    let frameworkFirst = fp_1.map(helpers_1.getFqShortname, framework);
    let externalPlugins = extract(topo.sort());
    return [...frameworkFirst, ...externalPlugins];
}
exports.solveOrdering = solveOrdering;
//# sourceMappingURL=solveOrdering.js.map