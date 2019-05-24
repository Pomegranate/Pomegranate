import { RuntimeFrameworkState } from "../index";
import { MagnumDI } from "magnum-di";
export declare const transformer: (FrameworkState: RuntimeFrameworkState, GlobalInjector: MagnumDI) => {
    fqn: (_: any, src: any) => any[];
    name: (_: any, src: any) => any[];
    baseDirectory: (_: any) => string;
    projectDirectory: (_: any) => string;
    buildDirectory: (_: any) => string;
};
