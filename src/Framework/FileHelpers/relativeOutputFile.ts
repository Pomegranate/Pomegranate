/**
 * @file relativeOutputFile
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {outputFile} from "fs-extra";
import {joinWithBase} from "./joinWithBase";

export interface outputFileOptions {
  encoding?: string
  mode?: number
  flag: string
}

export const relativeOutputFile = (basepath: string) => {
  return (filepath: string, data: string | Buffer, options?: outputFileOptions): Promise<void> => {
    return outputFile(joinWithBase(basepath, filepath), data, options)
  }
}