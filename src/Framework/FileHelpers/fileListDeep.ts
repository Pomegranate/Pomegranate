/**
 * @file fileListDeep
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';
import Bluebird from 'bluebird'
import {readdir, stat} from 'fs-extra'
import {join, parse} from 'path'
import {reduce, filter, defaults} from 'lodash/fp'
import {fileBaseName} from './fileBaseName'
const defaultOpts = defaults({hidden: false, ext: false})
const isHidden = /^\..*/
/**
 *
 * @module fileListDeep
 */

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
              return buildFilePath(p, options)
            }
            if(options.ext){
              return parse(p).ext === options.ext ? p : false;
            }

            return p
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

export const FileListDeepFromPath = (searchPath) =>{
  return function fileListDeep(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, options)
  }
}