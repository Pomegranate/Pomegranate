/**
 * @file configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import Bluebird from 'bluebird'
import stringifyObject from 'stringify-object'

import {fqParentName, getFqParentname} from "../../Plugin/helpers";
import {template as objTmpl} from '../FrameworkTemplates/build/objectConfiguration'
import {template as fnTmpl} from '../FrameworkTemplates/build/functionConfiguration'
import {compile} from 'handlebars'
import {toPairs, has, map, reduce, set, endsWith, repeat, join as _join, compose, concat, get} from 'lodash/fp'
import {getConfigFilePath, configObjectPath, configPath} from '../../Plugin/helpers'
import {pathExists, outputFile, ensureDir} from "fs-extra";
import {join, relative} from 'path'

const compileObjFile = compile(objTmpl)
const compileFnFile = compile(fnTmpl)

const countTabs = (text) => {
  let count = 0;
  let index = 0;
  while (text.charAt(index++) === " ") {
    count++;
  }
  return count;
}

const reduceConfFormat = (acc, line): string[] => {
  if (endsWith('additionalDependencies: []', line)) {
    let n = countTabs(line)
    acc.push(`${line},`)
    acc.push(`${repeat(n, ' ')}//logLevel: 0,`)
    acc.push(`${repeat(n, ' ')}//timeout: 10000`)
    return acc
  }
  acc.push(line)
  return acc
}


const formatObject = function (confObj: {configuration: any}, fnEnv: boolean) {
  let joiner = fnEnv ? '\n  ' : '\n'
  let splut = stringifyObject(confObj.configuration, {indent: '  '}).split('\n')
  return _join(joiner, reduce(reduceConfFormat, [], splut))
}

const ensurePluginDirectory = (baseDir) =>{
  return (path)=>{
    let rel = relative(baseDir, path)

    // console.log(baseDir, path, rel)

    return pathExists(path)
      .then((exists): boolean | any => {
        if(exists){
          console.log(`Application directory "./${rel}" exists, skipping.`)
          return false
        }
        return ensureDir(path)
      })
      .then((result) => {
        if(result){
          console.log(`Application directory "./${rel}" created`)
        }
        return result
      })
  }
}


const ensurePluginConfig = (baseDir,path,contents) => {
  let rel = relative(baseDir, path)
  return pathExists(path)
    .then((exists): boolean | any => {
      if(exists){
        console.log(`Config file "./${rel}" exists, skipping.`)
        return 'exists'
      }
      return outputFile(path, contents)
    })
    .then((result) => {
      if(result !== 'exists'){
        console.log(`Config file "./${rel}" created.`)
      }
      return result
    })
}

export const buildConfiguration = (PomInstance) => {
  return (argv) => {

    let templateCompiler = argv.env ? compileFnFile : compileObjFile

    let Config = get('Config', PomInstance)

    let creationTime = new Date().toDateString()
    let confs = reduce((acc, plugin) => {
      let pushPropPath = configObjectPath(plugin)
      let confPath = `${join(Config.projectPluginConfigDirectory, getConfigFilePath(plugin))}.js`
      // console.log(plugin)
      if (!has(confPath, acc)) {
        acc[confPath] = {
          configuration: {},
          baseDir: plugin.baseDirectory,
          projectDirectory: plugin.projectDirectory,
          pluginName: getFqParentname(plugin)
        }
      }
      acc[confPath].directories = acc[confPath].directories || []
      acc[confPath].directories = concat(acc[confPath].directories,map(([k, v])=> v, toPairs(plugin.projectDirectories)))

      let fullConfig = set(pushPropPath('config'), {disabled: false, additionalDependencies: [],}, acc[confPath].configuration)
      acc[confPath].configuration = set(pushPropPath('variables'), plugin.variables, fullConfig)
      return acc
    }, {}, PomInstance.Plugins)


    return Bluebird.each(toPairs(confs), ([p, v]: [any, any]) => {
      let contents = templateCompiler({
        configName: v.pluginName,
        configDate: creationTime,
        configObject: formatObject(v, argv.env)
      })
      let ps = [
        ensurePluginConfig(v.baseDir,p, contents),
        ...map(ensurePluginDirectory(v.baseDir), v.directories)
      ]
      return Bluebird.all(ps)
    })

  }
}

