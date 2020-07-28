import { Direction, Resize } from './direction';
import { Point } from './point';
import { Rect } from './rect';
import { Line } from './line';
export declare type TableFields = {
    name: string;
    primaryKey: boolean;
};
declare type Table = {
    isGroup: boolean;
    name: string;
    fields?: Array<TableFields>;
    titleRect: Rect;
    collapseRect: Rect | null;
    collapse?: boolean;
    hidden?: boolean;
};
export declare class Node {
    key: number;
    parent?: number;
    rect: Rect;
    table: Table;
    padding?: number;
    fontSize?: number;
    alias?: string;
    active?: boolean;
    anchors: Array<Point>;
    constructor(options: Node);
    toPoints(): Point[];
    toRect(): Rect;
    translate(delta: {
        x: number;
        y: number;
    }, lines?: Array<Line>): void;
    calcResizer(): Point[];
    hitResizer(pos: Point): number | undefined;
    resize(nodes: Array<Node>, direction: Resize, delta: {
        x: number;
        y: number;
    }, lines?: Array<Line>): void;
    resizeFromParent(parent: Node, delta: {
        x: number;
        y: number;
    }, direction: Direction): void;
    _calcLinePosition(pos: Point): void;
    calcAnchors(): Point[];
    getChildNode(nodes: Array<Node>): Node[];
    getGenerations(nodes: Array<Node>): Node[];
    getParentNode(nodes: Array<Node>): Node | undefined;
    outBounds(nodes: Array<Node>, delta: {
        x: number;
        y: number;
    }): boolean;
    updateNodeAnchorStatus(status: boolean): void;
}
export {};
