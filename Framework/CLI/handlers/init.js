"use strict";
/**
 * @file init
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pomSettings_1 = require("../FrameworkTemplates/init/pomSettings");
const pomScript_1 = require("../FrameworkTemplates/init/pomScript");
const handlebars_1 = require("handlebars");
const bluebird_1 = __importDefault(require("bluebird"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
exports.init = (PomInstance) => {
    return (argv) => __awaiter(this, void 0, void 0, function* () {
        let normalized = path_1.normalize(path_1.join(process.cwd(), argv.path));
        let settingsFile = path_1.join(argv.path, 'PomegranateSettings.js');
        let startFile = path_1.join(argv.path, 'pom.js');
        let buildDir = path_1.join(argv.path, argv.buildDir);
        let projectDir = path_1.join(argv.path, argv.projectDir);
        let projectApplicationDir = path_1.join(projectDir, 'application');
        let projectPluginDir = path_1.join(projectDir, 'plugins');
        let projectPluginSettingsDir = path_1.join(projectDir, 'pluginConfigs');
        let buildApplicationDir = path_1.join(buildDir, 'application');
        let buildPluginDir = path_1.join(buildDir, 'plugins');
        let buildPluginSettingsDir = path_1.join(buildDir, 'pluginConfigs');
        let templateData = {
            AppName: argv.name,
            CreateDate: new Date().toDateString(),
            buildDir: argv.buildDir,
            projectDir: argv.projectDir
        };
        return bluebird_1.default.props({
            settings: fs_extra_1.pathExists(settingsFile),
            start: fs_extra_1.pathExists(startFile)
        })
            .then((dirsExist) => {
            if (!argv.force && (dirsExist.start || dirsExist.settings)) {
                throw new Error('pom.js and/or PomegranateSettings.js already exist, rerun with -f to overwrite.');
            }
            if (argv.force) {
                console.log('Overwriting Pomegranate init files.');
            }
            return bluebird_1.default.props({
                settings: handlebars_1.compile(pomSettings_1.template)(templateData),
                start: handlebars_1.compile(pomScript_1.template)(templateData)
            });
        })
            .then((compiledTemplates) => {
            return bluebird_1.default.all([
                fs_extra_1.outputFile(settingsFile, compiledTemplates.settings),
                fs_extra_1.outputFile(startFile, compiledTemplates.start)
            ]);
        })
            .then(() => {
            return bluebird_1.default.all([
                fs_extra_1.ensureDir(buildApplicationDir),
                fs_extra_1.ensureDir(buildPluginDir),
                fs_extra_1.ensureDir(buildPluginSettingsDir),
                fs_extra_1.ensureDir(projectApplicationDir),
                fs_extra_1.ensureDir(projectPluginDir),
                fs_extra_1.ensureDir(projectPluginSettingsDir),
            ]);
        })
            .then((result) => {
            console.log(`Initialized Pomegranate app "${argv.name}" at \n   ${normalized}`);
            return null;
        });
    });
};
//# sourceMappingURL=init.js.map