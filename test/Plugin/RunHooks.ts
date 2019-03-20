/**
 * @file RunHooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
;

import {Pomegranate} from '../../src/Framework/Pomegranate'
import {blankConsole} from "../../test_mocks/ObjectGenerators/blankConsole";

let baseConf = {
  buildDirectory: '.',
  projectDirectory: '.',
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: ['pom-test'],
  logger: console || blankConsole,
  timeout: 2000,
  logLevel: 0,
  colorOutput: true
}

describe('The Pomegranate framework runtime', () => {

  test('Any Type plugins', async () => {
    let baseDirectory = `${__dirname}/../../test_mocks/PluginTypes/Sorting`
    // @ts-ignore
    let Pom = await Pomegranate(baseDirectory,baseConf)
    let loadResult = await Pom.load()
    let startResult = await Pom.start()
    let stopResult = await Pom.stop()
  })
});