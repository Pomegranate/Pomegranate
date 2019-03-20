// import {get} from 'lodash/fp'
const {get} = require('lodash/fp')
const {discoverNamespaced, discoverLocal} = require('../dist/discoverPlugins')
const {PomegranateConfig} = require('../dist/Configuration')

describe('Finding Plugins', () => {
  jest.enableAutomock()
  test('Namespace plugins', async () => {
    let searchDirectory = `${__dirname}/../test_mocks/Application_Compiled/Working_Examples`
    let rawConf = {
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: [],
      logger: console,
      timeout: 2000,
      logLevel: 2,
      colorOutput: true
    }
    try {
      let pconf = await PomegranateConfig(searchDirectory, rawConf)
      let plugins = await discoverNamespaced(get('pkgDependencies', pconf))
      console.log(plugins)
    } catch (e) {
      console.log(e)
    }

  })
  test('Project local plugins', async () => {
    let searchDirectory = `${__dirname}/../test_mocks/Application_Compiled/Working_Examples`
    let rawConf = {
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: [],
      logger: console,
      timeout: 2000,
      logLevel: 2,
      colorOutput: true
    }

    try {
      let pconf = await PomegranateConfig(searchDirectory, rawConf)
      let plugins = await discoverLocal(get('pluginDirectory', pconf))
      console.log(plugins)
    } catch (e) {
      console.log(e.message)
    }

  })
});