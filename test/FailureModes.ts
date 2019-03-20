/**
 * @file StartupFailureModes
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {map} from 'lodash/fp'
import {Pomegranate} from '../src/Framework/Pomegranate'
import {blankConsole} from "../test_mocks/ObjectGenerators/blankConsole";
import {join} from 'path'
import {pathExists, readdirSync} from 'fs-extra'

const baseConf = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: ['pom-test'],
  logger:  blankConsole,
  timeout: 2000,
  logLevel: 0,
  colorOutput: true
}



let tester = async (dir) => {
  let localConf = join(dir, 'PomegranateConfig.js')
  let hasConf = await pathExists(join(localConf))
  let useConf = hasConf ? require(localConf).PomegranateConfig : baseConf
  try {
    await Pomegranate(dir, useConf)
  }
  catch(e){
    // console.log(e)
    throw e
  }
}

describe('Startup Failure Handling',()=> {
  const mocksDirectory = `${__dirname}/../test_mocks/FailureHandling/StartupFailures`
  let mockApps = readdirSync(mocksDirectory)

  map((app) => {
    test(`${app} Failure mode`, async () => {
      let dir = join(mocksDirectory, app)
      await expect(tester(dir)).rejects.toEqual(expect.any(Error))
    })
  }, mockApps)
});


describe('Plugin Loading Failure Handling', () => {
  const mocksDirectory = `${__dirname}/../test_mocks/FailureHandling/PluginLoadingFailures`
  let mockApps = readdirSync(mocksDirectory)

  map((app) => {
    test(`${app} Failure mode`, async () => {
      let dir = join(mocksDirectory, app)
      await expect(tester(dir)).rejects.toEqual(expect.any(Error))
    })
  }, mockApps)
});