/**
 * @file config
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare function configurePomegranate(PomInstance: any): {
    command: string;
    aliases: string;
    describe: string;
    builder: (yargs: any) => any;
    handler: () => void;
};
