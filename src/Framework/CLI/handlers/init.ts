/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {template as settingsTmpl} from '../FrameworkTemplates/init/pomSettings'
import {template as startTmpl} from '../FrameworkTemplates/init/pomScript'
import {compile} from 'handlebars'
import Bluebird from 'bluebird'
import {join, normalize} from 'path'
import {pathExists, outputFile, ensureDir} from "fs-extra";


export const init = (PomInstance) => {
 return async (argv: any) => {
   let normalized = normalize(join(process.cwd(),argv.path))
   let settingsFile = join(argv.path, 'PomegranateSettings.js')
   let startFile = join(argv.path, 'pom.js')
   let buildDir = join(argv.path, argv.buildDir)
   let projectDir = join(argv.path, argv.projectDir)


   let projectApplicationDir = join(projectDir,'application')
   let projectPluginDir = join(projectDir,'plugins')
   let projectPluginSettingsDir = join(projectDir,'pluginConfigs')

   let buildApplicationDir = join(buildDir,'application')
   let buildPluginDir = join(buildDir,'plugins')
   let buildPluginSettingsDir = join(buildDir,'pluginConfigs')

   let templateData = {
     AppName: argv.name,
     CreateDate: new Date().toDateString(),
     buildDir: argv.buildDir,
     projectDir: argv.projectDir
   }

   return Bluebird.props({
     settings: pathExists(settingsFile),
     start: pathExists(startFile)
   })
     .then((dirsExist) => {

       if(!argv.force && (dirsExist.start || dirsExist.settings)){
         throw new Error('pom.js and/or PomegranateSettings.js already exist, rerun with -f to overwrite.')
       }
       if(argv.force) {console.log('Overwriting Pomegranate init files.')}
       return Bluebird.props({
         settings: compile(settingsTmpl)(templateData),
         start: compile(startTmpl)(templateData)
       })
     })
     .then((compiledTemplates) => {
       return Bluebird.all([
         outputFile(settingsFile, compiledTemplates.settings),
         outputFile(startFile, compiledTemplates.start)
       ])
     })
     .then(() => {
       return Bluebird.all([
         ensureDir(buildApplicationDir),
         ensureDir(buildPluginDir),
         ensureDir(buildPluginSettingsDir),
         ensureDir(projectApplicationDir),
         ensureDir(projectPluginDir),
         ensureDir(projectPluginSettingsDir),
       ])
     })
     .then((result) => {
       console.log(`Initialized Pomegranate app "${argv.name}" at \n   ${normalized}`)
       return null
     })

 }
}
