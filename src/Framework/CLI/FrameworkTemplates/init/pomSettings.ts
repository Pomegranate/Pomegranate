



export const template = `/*
* Pomegranate Application: {{AppName}}
* Created On: {{CreateDate}}
*
* Pomegranate Runtime Settings.
*
*/

module.exports = {
  buildDirectory: '{{buildDir}}', // Compiled output
  projectDirectory: '{{projectDir}}', // Local plugins, plugin configs, plugin application directories live here.
  applicationDirectory: './application', // Main directory for plugins to store files.
  pluginDirectory: './plugins', // Local plugin directory.
  pluginConfigDirectory: './pluginConfigs', // Plugin settings and variables.
  pluginNamespaces: [], // Loads plugins from these namespaces. Internally contains @pomOfficial and @pomApplications
  logger: console, // The logging interface to use.
  timeout: 2000, // Global plugin hook timeout
  logLevel: 2, // Verbocity
  colorOutput: true, // Pretty console?
  telemetry: true // Enables anonymous collection of statistical data from the Pomegranate CLI.
}`