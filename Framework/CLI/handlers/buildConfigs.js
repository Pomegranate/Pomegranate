"use strict";
/**
 * @file configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const stringify_object_1 = __importDefault(require("stringify-object"));
const helpers_1 = require("../../Plugin/helpers");
const objectConfiguration_1 = require("../FrameworkTemplates/build/objectConfiguration");
const functionConfiguration_1 = require("../FrameworkTemplates/build/functionConfiguration");
const handlebars_1 = require("handlebars");
const fp_1 = require("lodash/fp");
const helpers_2 = require("../../Plugin/helpers");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const compileObjFile = handlebars_1.compile(objectConfiguration_1.template);
const compileFnFile = handlebars_1.compile(functionConfiguration_1.template);
const countTabs = (text) => {
    let count = 0;
    let index = 0;
    while (text.charAt(index++) === " ") {
        count++;
    }
    return count;
};
const reduceConfFormat = (acc, line) => {
    if (fp_1.endsWith('additionalDependencies: []', line)) {
        let n = countTabs(line);
        acc.push(`${line},`);
        acc.push(`${fp_1.repeat(n, ' ')}//logLevel: 0,`);
        acc.push(`${fp_1.repeat(n, ' ')}//timeout: 10000`);
        return acc;
    }
    acc.push(line);
    return acc;
};
const formatObject = function (confObj, fnEnv) {
    let joiner = fnEnv ? '\n  ' : '\n';
    let splut = stringify_object_1.default(confObj.configuration, { indent: '  ' }).split('\n');
    return fp_1.join(joiner, fp_1.reduce(reduceConfFormat, [], splut));
};
const ensurePluginDirectory = (baseDir) => {
    return (path) => {
        let rel = path_1.relative(baseDir, path);
        // console.log(baseDir, path, rel)
        return fs_extra_1.pathExists(path)
            .then((exists) => {
            if (exists) {
                console.log(`Application directory "./${rel}" exists, skipping.`);
                return false;
            }
            return fs_extra_1.ensureDir(path);
        })
            .then((result) => {
            if (result) {
                console.log(`Application directory "./${rel}" created`);
            }
            return result;
        });
    };
};
const ensurePluginConfig = (baseDir, path, contents) => {
    let rel = path_1.relative(baseDir, path);
    return fs_extra_1.pathExists(path)
        .then((exists) => {
        if (exists) {
            console.log(`Config file "./${rel}" exists, skipping.`);
            return 'exists';
        }
        return fs_extra_1.outputFile(path, contents);
    })
        .then((result) => {
        if (result !== 'exists') {
            console.log(`Config file "./${rel}" created.`);
        }
        return result;
    });
};
exports.buildConfiguration = (PomInstance) => {
    return (argv) => {
        let templateCompiler = argv.env ? compileFnFile : compileObjFile;
        let Config = fp_1.get('Config', PomInstance);
        let creationTime = new Date().toDateString();
        let confs = fp_1.reduce((acc, plugin) => {
            let pushPropPath = helpers_2.configObjectPath(plugin);
            let confPath = `${path_1.join(Config.projectPluginConfigDirectory, helpers_2.getConfigFilePath(plugin))}.js`;
            // console.log(plugin)
            if (!fp_1.has(confPath, acc)) {
                acc[confPath] = {
                    configuration: {},
                    baseDir: plugin.baseDirectory,
                    projectDirectory: plugin.projectDirectory,
                    pluginName: helpers_1.getFqParentname(plugin)
                };
            }
            acc[confPath].directories = acc[confPath].directories || [];
            acc[confPath].directories = fp_1.concat(acc[confPath].directories, fp_1.map(([k, v]) => v, fp_1.toPairs(plugin.projectDirectories)));
            let fullConfig = fp_1.set(pushPropPath('config'), { disabled: false, additionalDependencies: [], }, acc[confPath].configuration);
            acc[confPath].configuration = fp_1.set(pushPropPath('variables'), plugin.variables, fullConfig);
            return acc;
        }, {}, PomInstance.Plugins);
        return bluebird_1.default.each(fp_1.toPairs(confs), ([p, v]) => {
            let contents = templateCompiler({
                configName: v.pluginName,
                configDate: creationTime,
                configObject: formatObject(v, argv.env)
            });
            let ps = [
                ensurePluginConfig(v.baseDir, p, contents),
                ...fp_1.map(ensurePluginDirectory(v.baseDir), v.directories)
            ];
            return bluebird_1.default.all(ps);
        });
    };
};
//# sourceMappingURL=buildConfigs.js.map