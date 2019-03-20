"use strict";
/**
 * @file pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Pomegranate_1 = require("../Pomegranate");
const start = __importStar(require("./commands/start"));
const plugin_1 = require("./commands/plugin");
const build_1 = require("./commands/build");
const init_1 = require("./commands/init");
const config_1 = require("./commands/config");
exports.pomCli = (cwd) => __awaiter(this, void 0, void 0, function* () {
    let PomegranateSettings;
    let PomInstance;
    try {
        PomegranateSettings = require(path_1.join(cwd, 'PomegranateSettings'));
        PomegranateSettings.logLevel = 0;
        PomInstance = yield Pomegranate_1.CliData(cwd, PomegranateSettings);
    }
    catch (err) {
        console.log(err.message);
    }
    let yargs = require('yargs');
    yargs
        .command(init_1.initPomegranate(PomInstance))
        .command(build_1.buildPomegranate(PomInstance))
        .command(start)
        .command(plugin_1.plugin(PomInstance, PomegranateSettings))
        .command(config_1.configurePomegranate(PomInstance))
        .recommendCommands()
        .wrap(yargs.terminalWidth() - (yargs.terminalWidth() * 0.05))
        .demandCommand(1, 'You must provide at least one command.')
        .help()
        // .showHelpOnFail(true)
        .fail((msg, err) => {
        if (msg) {
            console.log(msg);
            yargs.showHelp();
        }
        if (err) {
            console.error(err.message);
        }
        process.exit(1);
    })
        .help()
        .argv;
});
//# sourceMappingURL=pomegranate.js.map