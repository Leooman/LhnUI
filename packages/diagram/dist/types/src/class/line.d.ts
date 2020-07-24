import { Point } from './point';
import { Rect } from './rect';
import { Node } from './node';
import { Direction } from './direction';
export declare class Line {
    id: string;
    name: string;
    from: Point;
    to: Point;
    controlPoints: Point[];
    fromArrow?: string;
    toArrow?: string;
    fromArrowSize: number;
    toArrowSize: number;
    fromArrowColor?: string;
    toArrowColor?: string;
    text?: string;
    active: boolean;
    animateColor?: string;
    animateSpan?: number;
    animatePos?: number;
    textRect?: Rect | null;
    isAnimate: boolean;
    animateFromSize: number;
    animateToSize: number;
    animateType: any;
    constructor(options?: Line);
    calcTextRect(): void;
    getTextRect(): Rect | null | undefined;
    pointIn(pos: Point): any;
    toTextPoints(): false | Point[];
    getCenter(): Point;
    getLineCenter(from: Point, to: Point): Point;
    _drawText(ctx: CanvasRenderingContext2D): void;
    calcControlPoints(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    getLineToDirection(to: Point): Direction | undefined;
    hidden(nodes: Array<Node>): boolean;
    getPointByPos(pos: number): Point | null;
    getLinePtByPos(from: Point, to: Point, pos: number): Point;
    round(): void;
    lineLen(from: Point, to: Point): number;
    translate(x: number, y: number): void;
    updateEndPoints(nodes: Array<Node>): void;
    updateEndPoint(nodes: Array<Node>, point: Point): Point;
    _calcPosition(pos: Point, node: Node, delta: {
        x: number;
        y: number;
    }): void;
    lineMove(from: Node, to: Node, delta: {
        x: number;
        y: number;
    }): void;
    lineEndMove(pos: Point, node: Node, delta: {
        x: number;
        y: number;
    }): void;
}
