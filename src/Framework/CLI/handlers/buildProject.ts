/**
 * @file configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import * as ts from 'typescript'
import {exec, spawn} from 'child_process'
import {PluginFileHandler} from "../../FileHelpers";
import {copy, emptyDir} from 'fs-extra'
import {filter, get} from 'lodash/fp'
import {join} from 'path'

const defaultTsOpts = {
  noEmitOnError: true,
  // noImplicitAny: true,
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  sourceMap: true,
  declaration: false
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    "Error",
    diagnostic.code,
    ":",
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine()
    )
  );
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

function watchMain() {
  const configPath = ts.findConfigFile(
    /*searchPath*/ "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
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
  const host = ts.createWatchCompilerHost(
    configPath,
    defaultTsOpts,
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  );

  // You can technically override any given hook on the host, though you probably
  // don't need to.
  // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
  // doesn't use `this` at all.
  const origCreateProgram = host.createProgram;
  host.createProgram = (
    rootNames: ReadonlyArray<string>,
    options,
    host,
    oldProgram
  ) => {
    console.log("** We're about to create the program! **");
    return origCreateProgram(rootNames, options, host, oldProgram);
  };
  const origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = program => {
    console.log("** We finished making the program! **");
    origPostProgramCreate!(program);
  };

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host);
  return new Promise(() => {

  })
}


function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
      );
    }
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  // console.log(`Process exiting with code '${exitCode}'.`);
  let fileCount = fileNames.length
  console.log(`Compiled ${fileCount} ${fileCount > 1 ? 'files': 'file'}.`)
  process.exit(exitCode);
}


export const buildProject = (PomInstance) => {
  return async (argv) => {
    let Config = get('Config', PomInstance)

    if(argv.clean){
      console.log('Cleaning build directory')
      await emptyDir(Config.buildDirectory)
    }
    if(argv.watch){
    }

    let pluginFiles = PluginFileHandler(Config.projectPluginDirectory)
    let applicationFiles = PluginFileHandler(Config.projectApplicationDirectory)
    let configFiles = PluginFileHandler(Config.projectPluginConfigDirectory)

    let pluginOut = join(Config.buildDirectory, pluginFiles.baseName)
    let applicationOut = join(Config.buildDirectory, applicationFiles.baseName)
    let configOut = join(Config.buildDirectory, configFiles.baseName)

    await copy(Config.projectPluginDirectory, pluginOut)
    await copy(Config.projectApplicationDirectory, applicationOut)
    await copy(Config.projectPluginConfigDirectory, configOut)

    let outputPlugin = PluginFileHandler(pluginOut)
    let outputApplication = PluginFileHandler(applicationOut)
    let outputConfigs = PluginFileHandler(configOut)

    let files = [
      ... await outputPlugin.fileListDeep({ext: '.ts'}),
      ... await outputApplication.fileListDeep({ext: '.ts'}),
      ... await outputConfigs.fileListDeep({ext: '.ts'})
    ]

    compile(files, defaultTsOpts)

    }
}

