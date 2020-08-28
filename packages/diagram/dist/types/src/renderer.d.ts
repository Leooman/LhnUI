import { Options, Node, Line, Point, EventType } from './class';
export declare class DiagramRenderer {
    parentElem: HTMLElement;
    options: Options;
    private data;
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    scaleRatio: number;
    grid: boolean | undefined;
    ctx: CanvasRenderingContext2D | null;
    canvasPos: any;
    activeHoverNode: Node | undefined;
    activeNode: Node | undefined;
    eventType: EventType;
    nodes: Array<Node>;
    lines: Array<Line>;
    mousedownPos: Point;
    activeAnchor: Point;
    newLineID: string;
    activeResizer: number;
    activeLineText?: Line;
    activeLine?: Line;
    activeLineControl?: Point;
    scrollTop: number;
    scrollLeft: number;
    padding: number;
    thumbnail?: HTMLCanvasElement;
    thumbnailCtx?: CanvasRenderingContext2D | null;
    thumbnailScale: number;
    thumbnailActive: boolean;
    constructor(parentElem: HTMLElement, options?: Options);
    load(options: Options): void;
    render(): void;
    registerEventListeners(): void;
    registerThumbnailEventListeners(): void;
    removeListener(events: any, listener?: string): void;
    initCanvasWH(): void;
    resize(size: {
        width: number;
        height: number;
    }): void;
    updateCanvasWH(): void;
    _calcMousePos(e: MouseEvent): Point;
    getActiveHoverNode(pos: Point, oldNode: Node | undefined): Node | undefined;
    getActiveNode(pos: Point): Node | undefined;
    getLineControl(line: Line, pos: Point): Point | undefined;
    getHitAnchor(node: Node, pos: Point): Point | undefined;
    inNode(nodes: Array<Node>, pos: Point): Node | undefined;
    inLineText(lines: Array<Line>, pos: Point): Line | boolean;
    addNode(node: Node): void;
    getActiveLine(pos: Point): Line | undefined;
    updateNodeActive(activeNode?: Node): void;
    updateLineActive(activeLine?: Line): void;
    addLine(line: any): void;
    calcScrollDistance(delta: {
        x: number;
        y: number;
    }): void;
    removeInvalidLine(): void;
    calcDelta(newPoint: Point, oldPoint: Point): {
        x: number;
        y: number;
    };
    handleTextClick(): Line | undefined;
    getParentNode(nodes: Array<Node>, pos: Point): Node | undefined;
    handleDragover(e: DragEvent): {
        key: string;
        parent: string | number;
        rect: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    } | {
        key: string;
        rect: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        parent?: undefined;
    };
    _registerListener(): any;
    _registerThumbnailListener(): any;
}
