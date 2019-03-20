"use strict";
/**
 * @file config
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const configList_1 = require("../handlers/configList");
const configSet_1 = require("../handlers/configSet");
const configGet_1 = require("../handlers/configGet");
function configurePomegranate(PomInstance) {
    return {
        command: 'config',
        aliases: 'c',
        describe: 'Configuration management commands',
        builder: (yargs) => {
            return yargs
                .command({
                command: 'list',
                aliases: 'l',
                describe: 'Lists Pomegranate configuration values',
                builder: {},
                handler: configList_1.configList(PomInstance)
            })
                .command({
                command: 'set <key> <value>',
                aliases: 's',
                describe: 'Sets the value of a Pomegranate config key.',
                builder: {},
                handler: configSet_1.configSet(PomInstance)
            })
                .command({
                command: 'get <key>',
                aliases: 'g',
                describe: 'Gets the value of a Pomegranate config key.',
                builder: {},
                handler: configGet_1.configGet(PomInstance)
            })
                .help();
        },
        handler: () => {
            yargs_1.default.showHelp();
        }
    };
}
exports.configurePomegranate = configurePomegranate;
//# sourceMappingURL=config.js.map