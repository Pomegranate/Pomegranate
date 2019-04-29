"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file CreatePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const ApplicationBuilder_1 = require("./builders/ApplicationBuilder");
const CommandBuilder_1 = require("./builders/CommandBuilder");
const CompositeBuilder_1 = require("./builders/CompositeBuilder");
const ActionBuilder_1 = require("./builders/ActionBuilder");
const InjectableBuilder_1 = require("./builders/InjectableBuilder");
const LoghandlerBuilder_1 = require("./builders/LoghandlerBuilder");
const OverrideBuilder_1 = require("./builders/OverrideBuilder");
let buildableTypes = ['action', 'anything', 'application', 'command', 'composite', 'factory', 'instance', 'loghandler', 'merge', 'override'];
function isBuildableType(builderName) {
    return fp_1.includes(builderName, buildableTypes);
}
exports.isBuildableType = isBuildableType;
function isPomegranateType(pomPlugin) {
    // @ts-ignore
    return fp_1.isObject(pomPlugin) && fp_1.isObject(pomPlugin.configuration);
}
exports.isPomegranateType = isPomegranateType;
function createFluent(builderType) {
    switch (builderType) {
        case 'action':
            return new ActionBuilder_1.ActionBuilder(builderType);
        case 'application':
            return new ApplicationBuilder_1.ApplicationBuilder(builderType);
        case 'anything':
        case 'factory':
        case 'instance':
        case 'merge':
            return new InjectableBuilder_1.InjectableBuilder(builderType);
        case 'loghandler':
            return new LoghandlerBuilder_1.LoghandlerBuilder(builderType);
        case 'command':
            return new CommandBuilder_1.CommandBuilder(builderType);
        case 'composite':
            return new CompositeBuilder_1.CompositeBuilder(builderType);
        case 'override':
            return new OverrideBuilder_1.OverrideBuilder(builderType);
        default:
            throw new Error(`No builder found for ${builderType}`);
    }
}
function createComplete(fullPlugin) {
    switch (fullPlugin.configuration.type) {
        case 'action':
            return new ActionBuilder_1.ActionBuilder(fullPlugin);
        case 'application':
            return new ApplicationBuilder_1.ApplicationBuilder(fullPlugin);
        case 'anything':
        case 'factory':
        case 'instance':
        case 'merge':
            return new InjectableBuilder_1.InjectableBuilder(fullPlugin);
        case 'loghandler':
            return new LoghandlerBuilder_1.LoghandlerBuilder(fullPlugin);
        case 'command':
            return new CommandBuilder_1.CommandBuilder(fullPlugin);
        case 'composite':
            return new CompositeBuilder_1.CompositeBuilder(fullPlugin);
        case 'override':
            return new OverrideBuilder_1.OverrideBuilder(fullPlugin);
        default:
    }
}
function CreatePlugin(builderType) {
    if (isBuildableType(builderType)) {
        return createFluent(builderType);
    }
    if (isPomegranateType(builderType)) {
        return createComplete(builderType);
    }
    throw new Error(`Unable to find a Pomegranate plugin type with the name ${builderType}
    available types are "action, anything, application, command, composite, factory, instance, loghandler, merge and override"`);
}
exports.CreatePlugin = CreatePlugin;
//# sourceMappingURL=CreatePlugin.js.map