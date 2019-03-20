/**
 * @file fileListNested
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
import Bluebird from 'bluebird'
import {stat, readdir} from 'fs-extra'
import {join, parse} from 'path'
import {defaults} from 'lodash/fp'
import {fileBaseName} from './fileBaseName'
const defaultOpts = defaults({hidden: false, ext: false})
const hiddenFile = /^\..*/;


function buildFilePath(searchPath, reducer, options) {
  return readdir(searchPath)
    .then(function(files: string[]) {

      return Bluebird.reduce(files, function(returnObj, file) {
        let sp = join(searchPath, file)

        if(!options.hidden) {
          let hidden = hiddenFile.test(file)
          if(hidden) {
            return returnObj
          }
        }

        return stat(sp)
          .then(function(fileStat) {

            if(fileStat.isDirectory()) {

              let o = returnObj[file] = {}

              return buildFilePath(sp, o, options)
                .then(function() {
                  return reducer
                })
            }

            if(fileStat.isFile()) {
              if(options.ext) {
                let matchesExt = parse(file).ext === options.ext;
                if(!matchesExt) return returnObj
              }
              returnObj[fileBaseName(file)] = sp
            }

            return returnObj
          })
      }, reducer)
    })
}

export const fileListNestedFromPath = (searchPath: string) =>{
  return function fileListNested(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, {}, options)
  }
}