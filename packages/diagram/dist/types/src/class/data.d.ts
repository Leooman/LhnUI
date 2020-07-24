import { Node } from './node';
import { Line } from './line';
import { Point } from './point';
export declare class Data {
    nodes: Node[];
    lines: Line[];
    lineName?: string;
    fromArrowType?: string;
    toArrowType?: string;
    scale?: number;
    locked?: number;
    constructor(options?: any);
    translateLineOptionToPoint(nodes: Array<Node>, options: {
        id: number | string;
        anchorIndex: number;
    }): Point | {
        id: number | string;
        anchorIndex: number;
    };
}
