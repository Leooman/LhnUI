interface RoundedRect {
    ctx: any;
    x: number;
    y: number;
    width: number;
    height: number;
    r: number;
    fill: boolean;
    stroke: boolean;
    multichamber: boolean;
    shadow: boolean;
}
export declare function drawRoundedRect({ ctx, x, y, width, height, r, fill, stroke, multichamber, shadow, }: RoundedRect): void;
export declare function drawShading(ctx: CanvasRenderingContext2D, canvas: any, scaleRatio: number): void;
export declare function fittingString(ctx: any, str: string, maxWidth: number): string;
export {};
