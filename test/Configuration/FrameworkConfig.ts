/**
 * @file FrameworkConfig
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {PomegranateConfig} from "../../src/Framework/Configuration";
import {join, normalize} from 'path'

describe('Framework configuration loading and validation', () => {
  test('Good values', async () => {

    let searchDirectory = `${__dirname}/../../test_mocks/ApplicationDirs/Ok`
    let rawConf = {
      buildDirectory: './',
      projectDirectory: './',
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: ['tnpom'],
      logger: console,
      timeout: 2000,
      logLevel: 2,
      colorOutput: true
    }
    let pconf = await PomegranateConfig(searchDirectory, rawConf)
    expect(pconf).toEqual(expect.objectContaining({
        buildDirectory: './',
        projectDirectory: './',
        applicationDirectory: './application',
        pluginDirectory: './plugins',
        pluginConfigDirectory: './pluginConfigs',
        pluginNamespaces: ['tnpom'],
        logger: console,
        timeout: 2000,
        logLevel: 2,
        colorOutput: true
      }
    ))

  })

  test('Bad Logger', async () => {

    let searchDirectory = `${__dirname}/../../test_mocks/ApplicationDirs/Ok`
    let rawConf = {
      buildDirectory: './',
      projectDirectory: './',
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: ['tnpom'],
      logger: {},
      timeout: 2000,
      logLevel: 2,
      colorOutput: true
    }
    try {
      // @ts-ignore
      let pconf = await PomegranateConfig(searchDirectory, rawConf)
    }
    catch(e){
      expect(e.validationErrors).toEqual(expect.objectContaining({
        logger: expect.any(Error),
      }))
    }
  })

  test('Bad Timeout', async () => {

    let searchDirectory = `${__dirname}/../../test_mocks/ApplicationDirs/Ok`
    let rawConf = {
      buildDirectory: './',
      projectDirectory: './',
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: ['tnpom'],
      logger: console,
      timeout: 'words',
      logLevel: 2,
      colorOutput: true
    }
    try {
      // @ts-ignore
      let pconf = await PomegranateConfig(searchDirectory, rawConf)
    }
    catch(e){
      expect(e.validationErrors).toEqual(expect.objectContaining({
        timeout: expect.any(Error),
      }))
    }
  })
  test('Bad logLevel', async () => {

    let searchDirectory = `${__dirname}/../../test_mocks/ApplicationDirs/Ok`
    let rawConf = {
      buildDirectory: './',
      projectDirectory: './',
      applicationDirectory: './application',
      pluginDirectory: './plugins',
      pluginConfigDirectory: './pluginConfigs',
      pluginNamespaces: ['tnpom'],
      logger: console,
      timeout: 1000,
      logLevel: -10,
      colorOutput: true
    }
    try {
      let pconf = await PomegranateConfig(searchDirectory, rawConf)
    }
    catch(e){
      expect(e.validationErrors).toEqual(expect.objectContaining({
        logLevel: expect.any(Error),
      }))
    }
  })
})