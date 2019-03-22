"use strict";
/**
 * @file DiscoverPlugins
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const monet_1 = require("monet");
const bluebird_1 = __importDefault(require("bluebird"));
const helpers_1 = require("./Configuration/helpers");
// import {isInjectableBuilder, isApplicationBuilder} from "@pomegranate/plugin-tools";
const parentRequire = function (id) {
    try {
        return require(id);
    }
    catch (err) {
        let parent = module.parent;
        for (; parent; parent = parent.parent) {
            try {
                return parent.require(id);
            }
            catch (ex) {
            }
        }
        throw new Error("Cannot find module '" + id + "' from parent...");
    }
};
const eitherUnwrapOrFail = (o, filename) => {
    return (fp_1.isFunction(fp_1.get('Plugin.getPlugin', o)))
        ? monet_1.Right(o.Plugin)
        : monet_1.Left(new Error(`${filename} failed to unwrap.`));
};
const eitherObjArrayOrErr = (o, filename) => {
    return (fp_1.isPlainObject(o) || fp_1.isArray(o)) ? monet_1.Right(o) : monet_1.Left(new Error(`${filename} must export an object or an array.`));
};
const startsWithAt = fp_1.startsWith('@');
const getNamespace = mod => startsWithAt(mod) ? fp_1.split('/', mod)[0] : null;
const onlyNamespaced = fp_1.filter((mod) => {
    return startsWithAt(fp_1.first(mod));
});
const onlyJs = fp_1.filter((f) => {
    return path_1.extname(f) === '.js';
});
const noExtname = fp_1.filter((f) => {
    return path_1.extname(f) === '';
});
const isDir = (path) => {
};
let isApplicationPlugin = fp_1.matchesProperty('configuration.type', 'application');
function isStandard(plugin) {
    return fp_1.has('configuration', plugin) && fp_1.has('hooks', plugin);
}
function isApplication(plugin) {
    return fp_1.isArray(plugin.applicationPlugins) && isApplicationPlugin(plugin);
}
function isSingleExport(plugin) {
    return fp_1.isObject(plugin.plugin);
}
function isInjectableBuilder(builder) {
    return builder.builderType === 'InjectablePlugin';
}
function isApplicationBuilder(builder) {
    return builder.builderType === 'ApplicationPlugin';
}
const unrollWrapper = (ns, loadSrc, moduleSrc) => {
    return (function unroll(parents = []) {
        let lineage = fp_1.clone(parents);
        return (builder) => {
            let plugin = builder.getPlugin();
            if (isApplicationBuilder(plugin)) {
                parents.push(plugin.state.configuration.name);
                return fp_1.flattenDeep(fp_1.map(unroll(parents), plugin.state.applicationPlugins));
            }
            // if (isInjectableBuilder(plugin)) {
            //   let r = Right(plugin.state).map((v) => {
            //     v.parents = lineage
            //     v.moduleSrc = moduleSrc
            //     v.namespace = ns
            //     v.loadSrc = loadSrc
            //     return v
            //   })
            //     .cata(
            //       fail => {
            //         throw fail
            //       },
            //       identity
            //     )
            //   return [r]
            // }
            // This is everything but application Plugins
            let r = monet_1.Right(plugin.state).map((v) => {
                v.parents = lineage;
                v.moduleSrc = moduleSrc;
                v.namespace = ns;
                v.loadSrc = loadSrc;
                return v;
            })
                .cata(fail => {
                throw fail;
            }, fp_1.identity);
            return [r];
            // if (isApplicationBuilder(plugin)) {
            //   parents.push(plugin.state.configuration.name)
            //   return flattenDeep(map(unroll(parents), plugin.state.applicationPlugins))
            // }
        };
    })();
};
const unrollPlugin = () => {
    return (function unroll(parents = []) {
        let lineage = fp_1.clone(parents);
        return (plugin) => {
            if (isApplication(plugin)) {
                parents.push(plugin.configuration.name);
                return fp_1.flattenDeep(fp_1.map(unroll(parents), plugin.applicationPlugins));
            }
            if (isSingleExport(plugin)) {
                plugin = plugin.plugin;
            }
            if (isStandard(plugin)) {
            }
            let m = monet_1.Right(plugin).map((v) => {
                v.parents = lineage;
                return v;
            });
            return [m];
        };
    })();
};
exports.discoverFramework = (plugins) => {
    return bluebird_1.default.map(plugins, (i) => {
        return monet_1.Right(i)
            .map((o) => {
            o.namespace = null;
            o.loadSrc = 'framework';
            o.parents = [];
            return o;
        })
            .cata(fail => {
            throw fail;
        }, fp_1.identity);
    });
};
// export const discoverNamespaced = (dependencies): Bluebird<any[]> => {
//   let onlyNs = onlyNamespaced(toPairs(dependencies))
//   return Bluebird.map(onlyNs, (i) => {
//     let ns = first(i)
//     let plugin = eitherObjArrayOrErr(require(ns), i)
//       .cata(
//         fail => {
//           throw fail
//         },
//         identity
//       )
//
//     let unroll = unrollPlugin()
//     let unrolled = unroll(plugin)
//     let unwrapLocal = appendUnwrap(getNamespace(ns), 'namespaced', ns)
//     return unwrapLocal(unrolled)
//   })
//     .then((plugins) => {
//       return flattenDeep(plugins)
//     })
//
// }
exports.discoverNamespaced = (dependencies) => {
    let onlyNs = onlyNamespaced(fp_1.toPairs(dependencies));
    return bluebird_1.default.map(onlyNs, (i) => {
        let ns = fp_1.first(i);
        // let plugin = eitherObjArrayOrErr(require(ns), i)
        //   .cata(
        //     fail => {
        //       throw fail
        //     },
        //     identity
        //   )
        //
        // let unroll = unrollPlugin()
        // let unrolled = unroll(plugin)
        // let unwrapLocal = appendUnwrap(getNamespace(ns), 'namespaced', ns)
        // return unwrapLocal(unrolled)
        let plugin = eitherUnwrapOrFail(parentRequire(ns), i)
            .cata(fail => {
            throw fail;
        }, fp_1.identity);
        let unroll = unrollWrapper(getNamespace(ns), 'namespaced', ns);
        return unroll(plugin);
    })
        .then((plugins) => {
        return fp_1.flattenDeep(plugins);
    });
};
const appendUnwrap = (ns, loadSrc, moduleSrc) => {
    return fp_1.map((p) => {
        return p.map((o) => {
            o.moduleSrc = moduleSrc;
            o.namespace = ns;
            o.loadSrc = loadSrc;
            return o;
        })
            .cata(fail => {
            throw fail;
        }, fp_1.identity);
    });
};
exports.discoverLocal = (pluginDirPath) => {
    return fs_extra_1.readdir(pluginDirPath)
        .then((files) => __awaiter(this, void 0, void 0, function* () {
        let jsFiles = onlyJs(files);
        let dirPathPlugins = yield helpers_1.filterIndexedDirs(pluginDirPath, files);
        return fp_1.map((i) => {
            let plugin = eitherUnwrapOrFail(require(path_1.join(pluginDirPath, i)), i)
                .cata(fail => {
                throw fail;
            }, fp_1.identity);
            let unroll = unrollWrapper(null, 'local', i);
            return unroll(plugin);
        }, [...jsFiles, ...dirPathPlugins]);
    }))
        .then((plugins) => {
        return fp_1.flattenDeep(plugins);
    });
};
//# sourceMappingURL=discoverPlugins.js.map