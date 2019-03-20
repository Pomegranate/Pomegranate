let {blankConsole} = require('../../../ObjectGenerators/blankConsole')

exports.PomegranateConfig = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginConfigDirectory: './pluginConfigs',
  pluginNamespaces: 'hello',
  logger:  blankConsole,
  timeout: 2000,
  logLevel: 4,
  colorOutput: true
}