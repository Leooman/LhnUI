import { Node } from './node';
import { Line } from './line';
export declare class Data {
    nodes: Node[];
    lines: Line[];
    lineName?: string;
    fromArrowType?: string;
    toArrowType?: string;
    scale?: number;
    locked?: number;
    constructor(options?: any);
}
