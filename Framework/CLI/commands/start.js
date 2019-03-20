"use strict";
/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const start_1 = require("../handlers/start");
exports.command = 'start [path]';
exports.aliases = 's';
exports.describe = 'Starts a Pomegranate application';
exports.builder = (yargs) => {
    let cwd = process.cwd();
    return yargs
        .positional('path', {
        description: 'path containing a pom.js',
        default: cwd,
        defaultDescription: 'package.json name if available',
        type: 'string'
    })
        .usage('Usage: $0 start [path]');
};
exports.handler = start_1.startPomegranate;
//# sourceMappingURL=start.js.map