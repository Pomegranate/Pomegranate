/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { Argv } from "yargs";
export declare function startPomegranate(): {
    command: string;
    describe: string;
    aliases: string;
    builder: (yargs: Argv<{}>) => Argv<{
        path: string;
    } & {
        f: string;
    }>;
    handler: (argv: any) => void;
};
