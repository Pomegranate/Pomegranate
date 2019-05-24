import {readdirSync} from "fs";
import {map} from "lodash/fp";
import {join} from "path";

/**
 * @file injectablePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import {conformDeep} from "lodash-fun";
import {InjectableValidator} from "../../src/Framework/Configuration/PluginValidation/InjectableValidator";

let validate = conformDeep(InjectableValidator)

let goodPlugin = CreatePlugin('anything')
  .configuration({
    name: 'goodPlugin',
    injectableParam: 'goodPlugin'
  })
  .hooks({
    load: () => {

    }
  })

console.log(goodPlugin.getPlugin())

test('Empty object fails validation', () => {
  return expect(validate({})).rejects.toEqual(expect.any(Error))
});

test('Good Object passes validation', async () => {
  let o = await validate(goodPlugin.getPlugin().state)
  console.log(o.validationErrors)
});

test('Empty object fails validation', async () => {
  try {
    await validate(goodPlugin.getPlugin().state) //validate({})
  }
  catch(e){
    console.log(Object.keys(e))
    console.log(Object.keys(e.validationErrors))
    Object.keys(e.validationErrors).forEach((k) => {
      console.log(e.validationErrors[k].message)
    })
  }
})
