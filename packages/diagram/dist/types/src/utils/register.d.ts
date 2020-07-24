import { Line, Point } from '../class';
export declare const drawLineFns: any;
export declare const drawArrowFns: any;
export declare function registerLine(name: string, drawFn: (ctx: CanvasRenderingContext2D, line: Line) => void, drawControlPointsFn?: (ctx: CanvasRenderingContext2D, line: Line) => void, controlPointsFn?: (line: Line) => void, dockControlPointFn?: (point: Point, line: Line) => void, pointInFn?: (point: Point, line: Line) => boolean, force?: boolean): boolean;
export declare function registerArrow(name: string, drawFn: (ctx: CanvasRenderingContext2D, from: Point, to: Point, size: number) => void, force?: boolean): boolean;
