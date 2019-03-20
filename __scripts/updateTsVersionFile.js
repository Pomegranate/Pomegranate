#!/usr/bin/env node

let {version: PomVersion} = require('../package')
let {version: MagnumVersion} = require('magnum-di/package')
let {version: ImmutableVersion} = require('immutable-dll/package')
let {outputFile} = require('fs-extra')

let output = `/* WARNING: This file was automatically generated as part of the build process.
 *
 * Requiring the package.json file from a src/ directory causes TypeScript to attempt to include that file in its compilation.
 * This prevents TS from being able to write its compilation output to the parent directory.
 */

export const MODULE_VERSIONS = [
    ['Pomegranate', '${PomVersion}'],
    ['MagnumDI', '${MagnumVersion}'],
    ['Immutable-DLL', '${ImmutableVersion}']
  ]
`

outputFile('./src/Framework/__MODULE_VERSIONS.ts', output, (err, _) => {
  if(err){
    console.log(err)
  }
  console.log('Updated file')
})