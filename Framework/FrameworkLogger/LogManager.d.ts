/**
 * @file LogManager
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { PomegranateLogger } from "./index";
export interface LogMessage {
    severity: string;
    verbocity: number;
    messages: any[];
}
export declare type PomLogger = 'pomegranate';
export declare type SystemLogger = 'system';
export interface LoggerData {
    source: PomLogger | SystemLogger | string;
    appendSource?: boolean;
    logLevel?: number;
    logFormat?: {
        log?: string[];
        warn?: string[];
        info?: string[];
        error?: string[];
    };
}
export interface LogHandler {
    (logMessage: LogMessage, loggerData: LoggerData): void;
}
export interface LogManager {
    process: any;
    createLogger: (loggerData: LoggerData) => PomegranateLogger;
    addHandler: (handler: LogHandler) => void;
    use: (source: string) => PomegranateLogger;
}
export declare const DataLogger: (metadata: any, processor: any) => PomegranateLogger;
export interface LogFormatting {
    log?: string[];
    warn?: string[];
    info?: string[];
    error?: string[];
}
export interface LogManagerDefaults {
    logLevel?: number;
    logFormat?: LogFormatting;
}
export declare const PomLogManager: (config?: LogManagerDefaults) => LogManager;
