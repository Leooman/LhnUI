import { DiagramRenderer } from './renderer';
import { Options } from './class';
export declare class Diagram extends DiagramRenderer {
    fns: any;
    constructor(parentElem: HTMLElement, options: Options | undefined, fns: any);
    handleDblClick(): import("./class").Node | undefined;
    handleTextClick(): import("./class").Line | undefined;
}
