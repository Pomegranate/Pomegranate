/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { Argv } from "yargs";
export declare const command = "start [path]";
export declare const aliases = "s";
export declare const describe = "Starts a Pomegranate application";
export declare const builder: (yargs: Argv<{}>) => Argv<{
    path: string;
}>;
export declare const handler: (argv: any) => Promise<void>;
