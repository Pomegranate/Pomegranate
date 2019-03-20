"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const init_1 = require("../handlers/init");
function initPomegranate(PomInstance) {
    return {
        command: 'init [name]',
        aliases: 'i',
        describe: 'Initialize a Pomegranate application',
        builder: (yargs) => {
            let cwd = process.cwd();
            let appName;
            try {
                appName = require(path_1.join(cwd, 'package.json')).name;
            }
            catch (err) {
                appName = 'My Pomegranate App';
            }
            return yargs
                .positional('name', {
                description: 'App name',
                default: appName,
                defaultDescription: 'package.json name if available',
                type: 'string'
            })
                .options('f', {
                alias: 'force',
                description: 'Overwrite existing files.',
                default: false,
                boolean: true
            })
                .option('p', {
                alias: 'path',
                description: 'Creation path',
                default: cwd,
                defaultDescription: 'process.cwd()',
                string: true
            })
                .option('d', {
                alias: 'projectDir',
                description: 'Project Directory',
                default: 'PomProject',
                defaultDescription: './PomProject',
                string: true
            })
                .option('b', {
                alias: 'buildDir',
                description: 'Build Directory',
                default: '.PomBuild',
                defaultDescription: './.PomBuild',
                string: true
            })
                .usage('Usage: $0 init [name]');
        },
        handler: init_1.init(PomInstance)
    };
}
exports.initPomegranate = initPomegranate;
//# sourceMappingURL=init.js.map