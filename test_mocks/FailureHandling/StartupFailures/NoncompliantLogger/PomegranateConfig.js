let {blankConsole} = require('../../../ObjectGenerators/blankConsole')

exports.PomegranateConfig = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: ['pom-test'],
  logger:  {},
  timeout: 2000,
  logLevel: 3,
  colorOutput: true
}