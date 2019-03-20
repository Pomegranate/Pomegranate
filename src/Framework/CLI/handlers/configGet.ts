import {get} from "lodash/fp";
import {copy, emptyDir} from "fs-extra";
import {PluginFileHandler} from "../../FileHelpers";
import {join} from "path";
import * as ts from "./buildProject";

/**
 * @file configGet
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const configGet = (PomInstance) => {
  return async (argv) => {
    console.log('Not implemented yet, sorry.')
  }
}