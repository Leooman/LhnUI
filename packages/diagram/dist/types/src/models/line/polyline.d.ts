import { Point, Line } from '../../class';
export declare function polyline(ctx: CanvasRenderingContext2D, l: Line): void;
export declare function polylineControlPoints(ctx: CanvasRenderingContext2D, l: Line): void;
export declare function polylineEndPoints(ctx: CanvasRenderingContext2D, l: Line): void;
export declare function calcPolylineControlPoints(l: Line): void;
export declare function pointInPolyline(point: Point, l: Line): boolean;
export declare function dockPolylineControlPoint(point: Point, l: Line): void;
