"use strict";
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
/**
 * @file configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const ts = __importStar(require("typescript"));
const FileHelpers_1 = require("../../FileHelpers");
const fs_extra_1 = require("fs-extra");
const fp_1 = require("lodash/fp");
const path_1 = require("path");
const defaultTsOpts = {
    noEmitOnError: true,
    // noImplicitAny: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.CommonJS,
    esModuleInterop: true,
    sourceMap: true,
    declaration: false
};
const formatHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
function reportDiagnostic(diagnostic) {
    console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
}
/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic) {
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
}
function watchMain() {
    const configPath = ts.findConfigFile(
    /*searchPath*/ "./", ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    // TypeScript can use several different program creation "strategies":
    //  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    //  * ts.createSemanticDiagnosticsBuilderProgram
    //  * ts.createAbstractBuilder
    // The first two produce "builder programs". These use an incremental strategy
    // to only re-check and emit files whose contents may have changed, or whose
    // dependencies may have changes which may impact change the result of prior
    // type-check and emit.
    // The last uses an ordinary program which does a full type check after every
    // change.
    // Between `createEmitAndSemanticDiagnosticsBuilderProgram` and
    // `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
    // For pure type-checking scenarios, or when another tool/process handles emit,
    // using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(configPath, defaultTsOpts, ts.sys, createProgram, reportDiagnostic, reportWatchStatusChanged);
    // You can technically override any given hook on the host, though you probably
    // don't need to.
    // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
    // doesn't use `this` at all.
    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames, options, host, oldProgram) => {
        console.log("** We're about to create the program! **");
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = program => {
        console.log("** We finished making the program! **");
        origPostProgramCreate(program);
    };
    // `createWatchProgram` creates an initial program, watches files, and updates
    // the program over time.
    ts.createWatchProgram(host);
    return new Promise(() => {
    });
}
function compile(fileNames, options) {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();
    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        }
    });
    let exitCode = emitResult.emitSkipped ? 1 : 0;
    // console.log(`Process exiting with code '${exitCode}'.`);
    let fileCount = fileNames.length;
    console.log(`Compiled ${fileCount} ${fileCount > 1 ? 'files' : 'file'}.`);
    process.exit(exitCode);
}
exports.buildProject = (PomInstance) => {
    return (argv) => __awaiter(this, void 0, void 0, function* () {
        let Config = fp_1.get('Config', PomInstance);
        if (argv.clean) {
            console.log('Cleaning build directory');
            yield fs_extra_1.emptyDir(Config.buildDirectory);
        }
        if (argv.watch) {
        }
        let pluginFiles = FileHelpers_1.PluginFileHandler(Config.projectPluginDirectory);
        let applicationFiles = FileHelpers_1.PluginFileHandler(Config.projectApplicationDirectory);
        let configFiles = FileHelpers_1.PluginFileHandler(Config.projectPluginConfigDirectory);
        let pluginOut = path_1.join(Config.buildDirectory, pluginFiles.baseName);
        let applicationOut = path_1.join(Config.buildDirectory, applicationFiles.baseName);
        let configOut = path_1.join(Config.buildDirectory, configFiles.baseName);
        yield fs_extra_1.copy(Config.projectPluginDirectory, pluginOut);
        yield fs_extra_1.copy(Config.projectApplicationDirectory, applicationOut);
        yield fs_extra_1.copy(Config.projectPluginConfigDirectory, configOut);
        let outputPlugin = FileHelpers_1.PluginFileHandler(pluginOut);
        let outputApplication = FileHelpers_1.PluginFileHandler(applicationOut);
        let outputConfigs = FileHelpers_1.PluginFileHandler(configOut);
        let files = [
            ...yield outputPlugin.fileListDeep({ ext: '.ts' }),
            ...yield outputApplication.fileListDeep({ ext: '.ts' }),
            ...yield outputConfigs.fileListDeep({ ext: '.ts' })
        ];
        compile(files, defaultTsOpts);
    });
};
//# sourceMappingURL=buildProject.js.map