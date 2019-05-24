/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {isNull} from "lodash/fp";
import {transformKeys, conformTransformed, isConformError, KeyTransformer} from "lodash-fun";
import {transformer, conformer} from "./FrameworkConfig";

export interface ValidatedTransformer {
  originalValues: any
  transformedValues: any
  conformedValues: any,
  transformErrors: null | {[key: string]: Error}
  conformErrors: null | {[key: string]: Error}
}

export const transformValidate = (transformer: KeyTransformer, conformer: KeyTransformer): (obj: any) => Promise<ValidatedTransformer> => {
  return async (obj: any): Promise<ValidatedTransformer> => {
    let transformed = await transformKeys(transformer, obj)
    let transformErrors = null
    let conformErrors = null
    try {
      conformTransformed(transformed)
    }
    catch(err){
      if (isConformError(err)) {
        transformErrors = err.validationErrors
      } else {
        throw err
      }
    }

    let conformed = await transformKeys(conformer, transformed)

    try {
      conformTransformed(conformed)
    }
    catch(err){
      if (isConformError(err)) {
        conformErrors = err.validationErrors
      } else {
        throw err
      }
    }

    return {
      originalValues: obj,
      transformedValues: transformed,
      conformedValues: conformed,
      transformErrors,
      conformErrors
    }
  }
}

export const frameworkConfigValid = (frameworkConfig: ValidatedTransformer): boolean => {
  return (isNull(frameworkConfig.conformErrors) && isNull(frameworkConfig.transformErrors))
}

export const transformFrameworkConfig = (basePath: string) => {
  return transformValidate(transformer(basePath), conformer)
}