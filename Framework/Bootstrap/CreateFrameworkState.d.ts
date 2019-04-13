import { RuntimeFrameworkState, ValidatedConfiguration } from "../Configuration";
import { PomegranateLogger } from "../FrameworkLogger";
import { IFutureState } from "../Common/FutureState";
export declare function CreateFrameworkState(frameworkLogger: PomegranateLogger, futureConf: IFutureState<ValidatedConfiguration>): Promise<IFutureState<RuntimeFrameworkState>>;
