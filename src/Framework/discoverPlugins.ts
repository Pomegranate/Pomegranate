/**
 * @file DiscoverPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {
  clone,
  filter,
  first,
  flattenDeep,
  get,
  has,
  identity,
  isArray,
  isFunction,
  isObject,
  isPlainObject,
  map,
  matchesProperty,
  split,
  startsWith,
  toPairs
} from 'lodash/fp'
import {extname, join} from 'path'
import {readdir} from 'fs-extra'
import {Either, Left, Right} from 'monet'
import Bluebird from "bluebird";
import {PomegranatePlugin} from "@pomegranate/plugin-tools";
import {PomegranateApplicationPlugin, PomegranateSingleExport, ValidatedPlugin} from "./Plugin";
import {filterIndexedDirs} from "./Configuration/helpers";
import {ApplicationBuilder, Builder, InjectableBuilder} from "./Plugin/Builders";


const parentRequire = function(id) {
  try {
    return require(id)
  }
  catch(err){
    let parent = module.parent;
    for (; parent; parent = parent.parent) {
      try {
        return parent.require(id);
      } catch(ex) {
      }
    }
    throw new Error("Cannot find module '" + id + "' from parent...");
  }

};

const eitherUnwrapOrFail = (o, filename): Either<Error, Builder> => {
  return (isFunction(get('Plugin.getPlugin', o)))
    ? Right(o.Plugin)
    : Left(new Error(`${filename} failed to unwrap.`))
}

const eitherObjArrayOrErr = (o, filename) => {
  return (isPlainObject(o) || isArray(o)) ? Right(o) : Left(new Error(`${filename} must export an object or an array.`))
}

const startsWithAt = startsWith('@')
const getNamespace = mod => startsWithAt(mod) ? split('/', mod)[0] : null
const onlyNamespaced = filter((mod: string[]) => {
  return startsWithAt(first(mod))
})

const onlyJs = filter<string>((f) => {
  return extname(f) === '.js'
})

const noExtname = filter<string>((f) => {
  return extname(f) === ''
})

const isDir = (path) => {
}

let isApplicationPlugin = matchesProperty('configuration.type', 'application')

function isStandard(plugin: PomegranatePlugin | PomegranateSingleExport | PomegranateApplicationPlugin | PomegranatePlugin[]): plugin is PomegranatePlugin {
  return has('configuration', <PomegranatePlugin>plugin) && has('hooks', <PomegranatePlugin>plugin)
}

function isApplication(plugin: PomegranatePlugin | PomegranateSingleExport | PomegranateApplicationPlugin | PomegranatePlugin[]): plugin is PomegranateApplicationPlugin {
  return isArray((<PomegranateApplicationPlugin>plugin).applicationPlugins) && isApplicationPlugin((<PomegranateApplicationPlugin>plugin))
}

function isSingleExport(plugin: PomegranatePlugin | PomegranateSingleExport | PomegranateApplicationPlugin | PomegranatePlugin[]): plugin is PomegranateSingleExport {
  return isObject((<PomegranateSingleExport>plugin).plugin)
}


function isInjectableBuilder(builder: Builder): builder is InjectableBuilder {
  return builder.builder === 'InjectableBuilder'
}

function isApplicationBuilder(builder: Builder): builder is ApplicationBuilder {
  return builder.builder === 'ApplicationBuilder'
}

const unrollWrapper = (ns, loadSrc, moduleSrc) => {
  return (function unroll(parents = []) {
    let lineage = clone(parents)
    return (builder: any) => {
      let plugin = builder.getPlugin()
      if (isApplicationBuilder(plugin)) {
        parents.push(plugin.state.configuration.name)
        let applicationPlugins = map(p => {p.application = true; return p}, flattenDeep(map(unroll(parents), plugin.state.applicationPlugins)))
        return applicationPlugins
      }


      // This is everything but application Plugins
      let r = Right(plugin.state).map((v) => {
        v.parents = lineage
        v.moduleSrc = moduleSrc
        v.namespace = ns
        v.loadSrc = loadSrc
        v.application = false
        return v
      })
        .cata(
          fail => {
            throw fail
          },
          identity
        )
      return [r]
    }
  })()
}


export const discoverFramework = (plugins: PomegranatePlugin[]): Bluebird<any[]> => {
  return Bluebird.map(plugins, (i) => {
    return Right(i)
      .map((o: ValidatedPlugin) => {
        o.namespace = null
        o.loadSrc = 'framework'
        o.parents = []
        return o
      })
      .cata(
        fail => {
          throw fail
        },
        identity
      )
  })
}


export const discoverNamespaced = (dependencies): Bluebird<any[]> => {
  let onlyNs = onlyNamespaced(toPairs(dependencies))
  return Bluebird.map(onlyNs, (i) => {
    let ns = first(i)

    let plugin = eitherUnwrapOrFail(parentRequire(ns), i)
      .cata(
        fail => {
          throw fail
        },
        identity
      )

    let unroll = unrollWrapper(getNamespace(ns), 'namespaced', ns)
    return unroll(plugin)
  })
    .then((plugins) => {
      return flattenDeep(plugins)
    })

}

const appendUnwrap = (ns, loadSrc, moduleSrc) => {
  return map((p: Either<Error, ValidatedPlugin>) => {
    return p.map((o) => {
      o.moduleSrc = moduleSrc
      o.namespace = ns
      o.loadSrc = loadSrc
      return o
    })
      .cata(
        fail => {
          throw fail
        },
        identity
      )
  })
}

export const discoverLocal = (pluginDirPath): Promise<any[]> | Bluebird<any[]> => {
  return readdir(pluginDirPath)
    .then(async (files: string[]) => {
      let jsFiles = onlyJs(files)
      let dirPathPlugins = await filterIndexedDirs(pluginDirPath, files)
      return map((i) => {
        let plugin = eitherUnwrapOrFail(require(join(pluginDirPath, i)), i)
          .cata(
            fail => {
              throw fail
            },
            identity
          )
        let unroll = unrollWrapper(null, 'local', i)
        return unroll(plugin)
      }, [...jsFiles, ...dirPathPlugins])
    })
    .then((plugins) => {
      return flattenDeep(plugins)
    })

}