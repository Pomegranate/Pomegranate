/**
 * @file walkWorkDir
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';
import Bluebird from 'bluebird'
import {readdir, stat} from 'fs-extra'
import {join, parse} from 'path'
import {reduce, filter, defaults} from 'lodash/fp'
import {fileBaseName} from "./fileBaseName";
const defaultOpts = defaults({hidden: false, ext: false})
const isHidden = /^\..*/

/**
 *
 * @module walkWorkDir
 */
function getBaseName(filePath){
  return function(uppercase = false){
    return fileBaseName(filePath, uppercase)
  }
}

function wrapBuildFilePath(filePath, options){
  return function(){
    return buildFilePath(filePath, options)
  }
}

function buildFilePath(filepath, options){
  return readdir(filepath)
    .then((files) => {
      return Bluebird.filter(files,(file) => {
        if(options.hidden){
          return true
        }
        return !isHidden.test(file)
      })
    })
    .then((files) => {
      return Bluebird.map(files, (file) => {
        let p = join(filepath, file)
        return stat(p)
          .then((stat) => {
            if(stat.isDirectory()){
              return {
                path: p,
                filename: file,
                directory: true,
                file: false,
                walk: wrapBuildFilePath(p, options),
                getBaseName: getBaseName(p)
              }
            }
            if(options.ext){
              if(parse(p).ext === options.ext){
                return {
                  path: p,
                  filename: file,
                  directory: false,
                  file: true,
                  walk: null,
                  getBaseName: getBaseName(p)
                }
              } else {
                return false
              }
            }

            return {
              path: p,
              filename: file,
              directory: false,
              file: true,
              walk: null,
              getBaseName: getBaseName(p)
            }
          })
      })
    })
    .then((files) => {
      return filter(Boolean,files)
    })
    .then((files) => {
      return reduce((a,b) => {
        return a.concat(b)
      }, [], files)
    })
}

export const WalkWorkDirPath = (searchPath) => {
  return function walkWorkDir(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, options)
  }
}