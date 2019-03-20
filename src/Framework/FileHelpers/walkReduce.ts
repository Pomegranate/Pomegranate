/**
 * @file walkReduce
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';

import Bluebird from 'bluebird'
import {defaults} from 'lodash/fp'
import {WalkWorkDirPath} from "./walkWorkDir";

const defaultOpts = defaults({hidden: false, ext: false})
const isHidden = /^\..*/

/**
 *
 * @module walkReduce
 */

function walkReduce(files, reduced, reduceFn = (file)=>{return file}){
  return Bluebird.reduce(files, (returnObj, file: any) => {
    if(file.directory){
      let o = returnObj[file.getBaseName()] = {}
      return file.walk()
        .then((files) => {
          return walkReduce(files, o, reduceFn)
        })
        .then(() => {
          return returnObj
        })

    }
    return Bluebird.try(() => {
      return reduceFn(file)

    })
      .then((result) => {
        returnObj[file.getBaseName()] = result
        return returnObj
      })

  }, reduced)
}

export const WalkReducePath = (searchPath: string)=>{
  return function fileListDeep(options = {}, reduceFn?){
    options = defaultOpts(options);
    let walkDir = WalkWorkDirPath(searchPath)
    return walkDir(options)
      .then((files) => {
        return walkReduce(files, {}, reduceFn)
      })
  }
}