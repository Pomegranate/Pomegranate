"use strict";
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, ok} = require('assert')
const {createServer} = require("http")
const {reduce, each} = require('lodash/fp')

exports.Plugin = InjectablePlugin()
.variables({a: 1, b: 2, c: 3})
.directories([
  {prop: 'main', path: '.'},
  {prop: 'stuff', path: './stuff'},
  {prop: 'other', path: 'other/stuff'}
])
.configuration({
  name: 'A',
  injectableParam: 'A',
  type: 'anything',
  depends: ['Z']
})
.hooks({
  load: async (PluginLogger, PluginVariables, Z, PluginStore, PluginFiles) => {
    let files = await PluginFiles('other').fileList({ext: '.js'})
    strictEqual(files.length, 3)
    let names = reduce((acc, file) => {
      acc.push(require(file.path).filename)
      return acc
    }, [], files)

    PluginStore.name = 'A'
    PluginStore.server = createServer((req, res) => {
      res.write(`${names.join(' - ')}`)
      res.end()
    })
    strictEqual(Z.name, 'Z')
    ok(PluginVariables)
    strictEqual(PluginVariables.a, 10)
    strictEqual(PluginVariables.b, 20)
    strictEqual(PluginVariables.c, 30)
    // throw new Error('Wubba lubba')
    return {name: 'A'}
  },
  start: (PluginLogger, A, PluginStore, PluginLateError) => {
    strictEqual(PluginStore.name, 'A')
    strictEqual(A.name, 'A')
    setTimeout(() => {
      PluginLateError(new Error('Boop'))
    }, 5000)
    PluginLogger.log('A is starting')

    PluginStore.server.listen(8080)
  },
  stop: (PluginLogger, PluginStore) => {
    return new Promise((resolve) => {
      PluginStore.server.close((a, b) => {
        resolve(true)
      })
    })

  }
})