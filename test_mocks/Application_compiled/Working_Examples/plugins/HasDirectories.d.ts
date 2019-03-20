/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ProvidesAction } from "./ProvideTypes";
export declare const variables: {};
export declare const directories: string[];
export declare const configuration: {
    name: string;
    type: string;
    injectableParam: string;
    depends: any[];
};
export declare const hooks: {
    load: (pa: ProvidesAction) => void;
};
export declare const commands: {};
