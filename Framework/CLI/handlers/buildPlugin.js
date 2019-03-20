"use strict";
/**
 * @file buildPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TsInjectablePlugin_1 = require("../FrameworkTemplates/plugin/TsInjectablePlugin");
const JsInjectablePlugin_1 = require("../FrameworkTemplates/plugin/JsInjectablePlugin");
const TsApplicationPlugin_1 = require("../FrameworkTemplates/plugin/TsApplicationPlugin");
const JsApplicationPlugin_1 = require("../FrameworkTemplates/plugin/JsApplicationPlugin");
const handlebars_1 = require("handlebars");
const fp_1 = require("lodash/fp");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ensurePlugin = (baseDir, path, contents, force) => {
    let rel = path_1.relative(baseDir, path);
    return fs_extra_1.pathExists(path)
        .then((exists) => {
        if (force || !exists) {
            return fs_extra_1.outputFile(path, contents);
        }
        console.log(`Plugin "./${rel}" exists, rerun with -f to overwrite.`);
        return 'exists';
    })
        .then((result) => {
        if (result !== 'exists') {
            console.log(`Plugin "./${rel}" created.`);
        }
        return result;
    });
};
const templateChoices = {
    application: {
        ts: {
            comments: null,
            clean: handlebars_1.compile(TsApplicationPlugin_1.template)
        },
        js: {
            comments: null,
            clean: handlebars_1.compile(JsApplicationPlugin_1.template)
        }
    },
    injectable: {
        ts: {
            comments: null,
            clean: handlebars_1.compile(TsInjectablePlugin_1.template)
        },
        js: {
            comments: null,
            clean: handlebars_1.compile(JsInjectablePlugin_1.template)
        }
    },
    command: {
        ts: {
            comments: null,
            clean: null
        },
        js: {
            comments: null,
            clean: null
        }
    }
};
exports.buildPlugin = (PomInstance) => {
    return (argv) => {
        let baseDirectory = fp_1.get('Config.baseDirectory', PomInstance);
        let fqbd = baseDirectory ? baseDirectory : argv.path;
        // console.log(argv)
        let chooseTemplatePath = `${argv.builder}.${argv.language}.${argv.comments ? 'comments' : 'clean'}`;
        let templateCompiler = fp_1.get(chooseTemplatePath, templateChoices);
        if (!templateCompiler) {
            console.log(`builder: ${argv.builder}, lang: ${argv.language}, output: ${argv.comments ? 'comments' : 'clean'}`);
            console.log('No match for that input combination found. Probably not implemented yet.');
            return;
        }
        let creationTime = new Date().toDateString();
        let compileData = {
            creationDate: new Date().toDateString(),
            type: argv.type,
            name: argv.name
        };
        let filename = `${argv.name}.${argv.language}`;
        let filepath = path_1.join(argv.path, filename);
        let contents = templateCompiler(compileData);
        return ensurePlugin(fqbd, filepath, contents, argv.force);
    };
};
//# sourceMappingURL=buildPlugin.js.map