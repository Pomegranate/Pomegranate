import {PomegranateConfig} from "../../src/Framework/Configuration";

/**
 * @file WorkingConfig
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const fakeLogger = {
  log: ()=>{},
  warn: ()=>{},
  info: ()=>{},
  error: ()=>{},
}

export const getWorkingConfig = async function (logger = fakeLogger) {
  let rawConf = {
    applicationDirectory: './application',
    pluginDirectory: './plugins',
    pluginConfigDirectory: './pluginConfigs',
    pluginNamespaces: ['tnpom'],
    logger: logger,
    timeout: 2000,
    logLevel: 2,
    colorOutput: true
  }
  let searchDirectory = `${__dirname}/../Application_Compiled/Working_Examples`
  return await PomegranateConfig(searchDirectory, rawConf)
}