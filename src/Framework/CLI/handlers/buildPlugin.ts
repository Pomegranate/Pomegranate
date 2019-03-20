/**
 * @file buildPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import Bluebird from 'bluebird'
import stringifyObject from 'stringify-object'

import {fqParentName, getFqParentname} from "../../Plugin/helpers";
import {template as InjectableTsClean} from '../FrameworkTemplates/plugin/TsInjectablePlugin'
import {template as InjectableJsClean} from '../FrameworkTemplates/plugin/JsInjectablePlugin'
import {template as ApplicationTsClean} from '../FrameworkTemplates/plugin/TsApplicationPlugin'
import {template as ApplicationJsClean} from '../FrameworkTemplates/plugin/JsApplicationPlugin'

import {compile} from 'handlebars'
import {toPairs, has, map, reduce, set, endsWith, repeat, join as _join, compose, concat, get} from 'lodash/fp'
import {getConfigFilePath, configObjectPath, configPath} from '../../Plugin/helpers'
import {pathExists, outputFile, ensureDir} from "fs-extra";
import {join, relative} from 'path'
import {switchWith} from "lodash-fun";


const ensurePlugin = (baseDir, path, contents, force) => {
  let rel = relative(baseDir, path)
  return pathExists(path)
    .then((exists): boolean | any => {
      if (force || !exists) {
        return outputFile(path, contents)
      }
      console.log(`Plugin "./${rel}" exists, rerun with -f to overwrite.`)
      return 'exists'

    })
    .then((result) => {
      if (result !== 'exists') {
        console.log(`Plugin "./${rel}" created.`)
      }
      return result
    })
}


const templateChoices = {
  application: {
    ts: {
      comments: null,
      clean: compile(ApplicationTsClean)
    },
    js: {
      comments: null,
      clean: compile(ApplicationJsClean)
    }

  },
  injectable: {
    ts: {
      comments: null,
      clean: compile(InjectableTsClean)
    },
    js: {
      comments: null,
      clean: compile(InjectableJsClean)
    }
  },
  command: {
    ts: {
      comments: null,
      clean: null
    },
    js: {
      comments:null,
      clean: null
    }
  }
}

export const buildPlugin = (PomInstance) => {
  return (argv) => {
    let baseDirectory = get('Config.baseDirectory', PomInstance)
    let fqbd = baseDirectory ? baseDirectory : argv.path

    // console.log(argv)
    let chooseTemplatePath = `${argv.builder}.${argv.language}.${argv.comments ? 'comments' : 'clean'}`
    let templateCompiler = get(chooseTemplatePath, templateChoices)

    if(!templateCompiler){
      console.log(`builder: ${argv.builder}, lang: ${argv.language}, output: ${argv.comments ? 'comments' : 'clean'}`)
      console.log('No match for that input combination found. Probably not implemented yet.')
      return
    }

    let creationTime = new Date().toDateString()
    let compileData = {
      creationDate: new Date().toDateString(),
      type: argv.type,
      name: argv.name
    }

    let filename = `${argv.name}.${argv.language}`
    let filepath = join(argv.path, filename)

    let contents = templateCompiler(compileData)

    return ensurePlugin(fqbd, filepath, contents, argv.force)
  }
}

