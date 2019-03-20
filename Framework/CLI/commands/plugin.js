"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../Plugin/helpers");
const fp_1 = require("lodash/fp");
const yargs_1 = __importDefault(require("yargs"));
function plugin(PomInstance, pomConf) {
    let plugins = fp_1.get('Plugins', PomInstance);
    let commands = fp_1.map((plugin) => {
        // console.log(toLower(first(fqShortName(plugin.configuration.name))))
        let Injector = fp_1.get('injector', plugin);
        let commandFunction = fp_1.get('commands', plugin);
        return {
            pluginName: helpers_1.getFqShortname(plugin),
            commandRoot: fp_1.toLower(helpers_1.fqDeclaredName(plugin.configuration.name)),
            builderFn: Injector.inject(commandFunction)
        };
    }, fp_1.filter(plugin => plugin.commands, plugins));
    return {
        command: 'plugin',
        describe: 'Runs Plugin stuff',
        aliases: 'p',
        builder: (yargs) => {
            yargs
                .usage('usage: $0 plugin [cmd]');
            fp_1.each((pluginCommander) => {
                // yargs.command(pluginCommander.commandRoot, `${pluginCommander.pluginName} Commands`,pluginCommander.builderFn)
                yargs.command({
                    command: pluginCommander.commandRoot,
                    describe: `${pluginCommander.pluginName} Commands`,
                    builder: pluginCommander.builderFn,
                    handler: (argv) => {
                        yargs.showHelp();
                    }
                });
            }, commands);
            return yargs
                .help();
        },
        handler: (args) => {
            yargs_1.default.showHelp();
        }
    };
}
exports.plugin = plugin;
//# sourceMappingURL=plugin.js.map