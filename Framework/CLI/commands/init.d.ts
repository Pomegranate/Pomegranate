/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { Argv } from "yargs";
export declare function initPomegranate(PomInstance: any): {
    command: string;
    aliases: string;
    describe: string;
    builder: (yargs: Argv<{}>) => Argv<{
        name: any;
    } & {
        f: boolean;
    } & {
        p: string;
    } & {
        d: string;
    } & {
        b: string;
    }>;
    handler: (argv: any) => Promise<any>;
};
