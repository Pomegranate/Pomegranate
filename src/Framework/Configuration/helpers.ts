/**
 * @file helpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


import {curry, fromPairs, constant, identity, memoize, filter, includes, map} from 'lodash/fp'
import {ifElseWith} from 'lodash-fun'
import {pathExists,pathExistsSync, stat, statSync, readdir} from 'fs-extra'
import {extname, join, normalize} from 'path'
import Bluebird from 'bluebird'

const isDir = memoize((path: string): boolean => {
  return pathExistsSync(path) && statSync(path).isDirectory()
})

export const joinBP = curry((basePath: string, path: string): string => {
  return join(normalize(basePath), path)
})

export function joinBasePath(basePath: string, path?: string): any  {
  // @ts-ignore
  return joinBP(...arguments)
}

const pathIs = ifElseWith(isDir)

export const settingPath = (fullPath, confProp) => {

  let setValue = pathIs(identity, constant(null))
  let setError = pathIs(constant(false), constant(new Error(`config.${confProp}: ${fullPath} does not exist or is not a directory.`)))
  return fromPairs([
    ['value', setValue(fullPath)],
    ['error', setError(fullPath)]
  ])
}

export function joinPluginWorkBase(basepath: string, workBase: string){
  return joinBasePath(basepath, workBase)
}

export function directoryExists(path){
  return pathExists(path)
    .then((exists) => {
      if(!exists) { throw new Error(`Path: ${path} does not exist.`)}
      return stat(path)
    })
    .then((stats) => {
      if(!stats.isDirectory()){throw new Error(`Path: ${path} is not a directory.`)}
      return path
    })
}

export function isDirectory(basePath, dir){
  let normal = joinBasePath(basePath, dir)
  return directoryExists(normal)
}



export async function requireFile(basePath, filePath){
  let normal = joinBasePath(basePath, filePath)
  let exists = await pathExists(normal)
  if(exists){
    return require(normal)
  }
}

const noExtname = filter<string>((f) => {
  return extname(f) === ''
})

export async function filterIndexedDirs(pluginDirPath: string, files: string[]){
  let indexDirectories = noExtname(files)
  let dirPathPlugins = await Bluebird.filter(indexDirectories, (file) => {
    return isDirectory(pluginDirPath, file)
      .then((p) => {
        return readdir(p)
      })
      .then((files) => {
        return includes('index.js', files)

      })
  })

  return dirPathPlugins
}