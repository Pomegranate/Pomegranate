/**
 * @file fileList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';
import Bluebird from 'bluebird'
import {readdir, stat} from 'fs-extra'
import {join, parse} from 'path'
import {filter, defaults} from 'lodash/fp'
import {fileBaseName} from "./fileBaseName";

// const fileBaseName = require('./fileBaseName')
const defaultOpts = defaults({hidden: false, ext: false, directories: false})
const isHidden = /^\..*/
/**
 *
 * @module fileList
 */

function getBaseName(filePath){
  return function(uppercase = false){
    return fileBaseName(filePath, uppercase)
  }
}

export const fileListFromPath = (searchPath: string) => {
  return function(options: any = {}){
    options = defaultOpts(options);
    return readdir(searchPath)
      .then((files) => {
        if(!options.hidden){
          files = filter((file) => {
            return !isHidden.test(file)
          }, files)
        }

        if(options.ext){
          files = filter((file)=>{
            return parse(file).ext === options.ext
          }, files)
        }

        return Bluebird.filter(files, (file) => {
          return stat(join(searchPath, file))
            .then((stat) => {
              if(options.directories) return stat.isDirectory()
              return stat.isFile()
            })
        }).then((files) => {
          return Bluebird.map(files, (file) => {
            let filePath = join(searchPath, file)
            return {
              path: filePath,
              filename: file,
              getBaseName: getBaseName(filePath)
            }
          })
        })
      })
  }
}