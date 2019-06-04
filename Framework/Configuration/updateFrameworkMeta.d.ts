import { ValidatedPlugin } from "../Plugin";
import { LogManager } from "../FrameworkLogger/LogManager";
import { ValidatedTransformer } from "../Validation";
import { Metrics } from "../FrameworkMetrics";
export declare const updateFrameworkMeta: (LogManager: LogManager, FrameworkConfiguration: ValidatedTransformer, frameworkMetrics: Metrics, skeletons: ValidatedPlugin[]) => ValidatedTransformer;
