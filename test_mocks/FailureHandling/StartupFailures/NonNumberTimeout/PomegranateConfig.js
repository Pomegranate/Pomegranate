let {blankConsole} = require('../../../ObjectGenerators/blankConsole')

exports.PomegranateConfig = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: ['pom-test'],
  logger:  blankConsole,
  timeout: 'hello',
  logLevel: 2,
  colorOutput: true
}