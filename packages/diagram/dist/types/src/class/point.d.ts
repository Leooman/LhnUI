import { Direction, Resize } from './direction';
import { Node } from './node';
export declare class Point {
    x: number;
    y: number;
    direction?: Direction | Resize | undefined;
    id?: string | number | undefined;
    hidden?: boolean | undefined;
    anchorIndex: number;
    constructor(x: number, y: number, direction?: Direction | Resize | undefined, id?: string | number | undefined, hidden?: boolean | undefined, anchorIndex?: number);
    clone(): Point;
    floor(): void;
    round(): void;
    hit(pt: Point, radius?: number): boolean;
    rotate(angle: number, center: {
        x: number;
        y: number;
    }): Point;
    getLinkNode(nodes: Array<Node>): Node | undefined;
    updateDirection(direction: Direction): void;
}
