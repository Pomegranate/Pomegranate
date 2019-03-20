let {blankConsole} = require('../../../ObjectGenerators/blankConsole')

exports.PomegranateConfig = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: ['pom-test'],
  logger:  blankConsole,
  timeout: 2000,
  logLevel: 'hello',
  colorOutput: true
}