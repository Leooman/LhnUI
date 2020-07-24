import { Point } from './point';
export declare class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    ex: number;
    ey: number;
    center: Point;
    constructor(x: number, y: number, w: number, h: number);
    init(): void;
    floor(): void;
    round(): void;
    clone(): Rect;
    hit(pt: Point, padding?: number): boolean;
    hitByRect(rect: Rect): boolean;
    hitRotate(point: Point, rotate: number, center: Point): boolean;
    calcCenter(): void;
    toPoints(): Point[];
    translate(x: number, y: number): void;
    scale(scale: number, center?: Point, scaleY?: number): void;
}
