import { Node } from '../../class';
export declare function drawTableNode(ctx: CanvasRenderingContext2D, nodes: Array<Node>): void;
export declare function drawResizer(ctx: CanvasRenderingContext2D, node: Node): void;
export declare function drawAnchors(ctx: CanvasRenderingContext2D, node: Node, scale: number, scrollLeft: number, scrollTop: number): void;
export declare function toggleCollapse(nodes: Array<Node>, node: Node): void;
